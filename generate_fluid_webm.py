import cv2
import numpy as np
import os

width, height = 500, 400
fps = 30
duration = 6 # seconds

# Try VP80 (WebM) which is natively supported by browsers
fourcc = cv2.VideoWriter_fourcc(*'VP80')
output_path = r'c:\Neuron\frontend\public\fluid_sim.webm'

out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

for t in range(fps * duration):
    # Generate fluid-like turbulence pattern
    X, Y = np.meshgrid(np.linspace(0, 4*np.pi, width), np.linspace(0, 3*np.pi, height))
    time_offset = t * 0.15
    
    # Simulate vorticity and flow
    flow_x = np.sin(X + time_offset) + np.cos(Y * 0.7 - time_offset*0.8)
    flow_y = np.cos(Y + time_offset*1.1) + np.sin(X * 0.6 + time_offset)
    
    # Calculate velocity magnitude
    magnitude = np.sqrt(flow_x**2 + flow_y**2)
    
    # Add a swirling vortex in the center
    cx, cy = width//2, height//2
    XX, YY = np.meshgrid(np.arange(width), np.arange(height))
    dist = np.sqrt((XX - cx)**2 + (YY - cy)**2) / 100.0
    vortex = np.sin(dist - time_offset*2) * np.exp(-dist*0.5)
    
    magnitude += np.abs(vortex) * 1.5
    
    # Map to colors (Velocity -> Heatmap)
    normalized = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    heatmap = cv2.applyColorMap(normalized, cv2.COLORMAP_TURBO)
    
    out.write(heatmap)

out.release()
print("Fluid simulation WEBM generated successfully!")
