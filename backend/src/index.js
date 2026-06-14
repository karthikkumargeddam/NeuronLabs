"use strict";
// import type { Core } from '@strapi/strapi';
Object.defineProperty(exports, "__esModule", { value: true });
const generateLabs150 = require('../generateLabs150.js');
const seedAdvancedLabs = require('../seed_advanced_labs.js');

exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register( /* { strapi }: { strapi: Core.Strapi } */) { },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }) {
        // Initialize Socket.io
        const { Server } = require("socket.io");
        const io = new Server(strapi.server.httpServer, {
            cors: {
                origin: ["http://localhost:3000", "https://neuron-frontend-o7em.vercel.app"],
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                credentials: true,
            },
        });

        io.on("connection", (socket) => {
            console.log("Client connected via Socket.io:", socket.id);
            
            socket.on("join", (userId) => {
                socket.join(`user_${userId}`);
                console.log(`Socket ${socket.id} joined room user_${userId}`);
            });

            // Multiplayer Collaboration Events
            socket.on("join-lab", (labId) => {
                socket.join(`lab_${labId}`);
                console.log(`Socket ${socket.id} joined lab_${labId}`);
                // Notify others in the lab
                socket.to(`lab_${labId}`).emit("user-joined", { id: socket.id });
            });

            socket.on("code-change", (data) => {
                // data: { labId, code }
                socket.to(`lab_${data.labId}`).emit("code-update", data.code);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });

        strapi.io = io; // Attach to strapi instance to use in services/controllers

        // Initialize Yjs WebSocket Server
        const { WebSocketServer } = require('ws');
        const { setupWSConnection } = require('y-websocket/bin/utils');

        const wss = new WebSocketServer({ noServer: true });

        strapi.server.httpServer.on('upgrade', (request, socket, head) => {
            if (request.url.startsWith('/yjs')) {
                wss.handleUpgrade(request, socket, head, (ws) => {
                    wss.emit('connection', ws, request);
                });
            }
        });

        wss.on('connection', setupWSConnection);

        // FORCE SEED RE-RUN
        await generateLabs150(strapi);
        console.log("\n=======================================================");
        console.log("✅ SUCCESS: 150 uniquely distinct PhD concepts are fully seeded!");
        console.log("=======================================================\n");

        await seedAdvancedLabs(strapi);

        // Run the cloud seeder
        const cloudSeeder = require('./cloud_seeder.js');
        await cloudSeeder(strapi);

        // Seed pages
        const pages = [
            {
              title: 'Documentation',
              slug: 'documentation',
              content: `## Getting Started\n\nWelcome to the NeuronLabs Documentation. Here you will find everything you need to know about setting up your sandbox environments, navigating the PhD-level curriculum, and utilizing distributed training clusters.\n\nTo begin, create an account using the Sign Up portal, and spin up your first Virtual Box instance from the "Sandboxes" tab.\n\n## Virtual Boxes\n\nOur Virtual Box environments are pre-configured Linux instances designed for high-performance computing. They come fully loaded with:\n- CUDA 12.x Toolkit\n- PyTorch & TensorFlow (GPU accelerated)\n- Docker & Docker Compose\n- Root access for complete environment control\n\n## Course Progress\n\nYour progression in the "Courses" tab is automatically tracked. Any code you write within the embedded browser IDE is saved to your account session. Ensure you are signed in before starting a module.`
            },
            {
              title: 'API Reference',
              slug: 'api-reference',
              content: `Programmatically control your sandboxes, access course materials, and trigger remote training runs via the NeuronLabs REST API.\n\n### \`GET /api/courses\`\nRetrieves a paginated list of all available PhD-level courses and labs.\n\`\`\`bash\ncurl -X GET "https://api.neuronlabs.edu/v1/courses" \\\n  -H "Authorization: Bearer YOUR_API_TOKEN"\n\`\`\`\n\n### \`POST /api/sandboxes/provision\`\nProvisions a new isolated Virtual Box cluster with the requested GPU configuration.\n\`\`\`bash\ncurl -X POST "https://api.neuronlabs.edu/v1/sandboxes/provision" \\\n  -H "Content-Type: application/json" \\\n  -d '{"gpu_type": "A100", "count": 2, "image": "pytorch:latest"}'\n\`\`\``
            },
            {
              title: 'Support',
              slug: 'support',
              content: `Whether you're dealing with a hanging training loop or a cluster provisioning error, our dedicated support team for PhD researchers is available 24/7.\n\n### Technical Support\nIssues with your Virtual Box, GPU allocation, or code execution environments.\n**Email:** support@neuronlabs.edu\n\n### Academic Advising\nQuestions regarding course curriculum, PhD research tracks, and module certifications.\n**Email:** academic@neuronlabs.edu`
            },
            {
              title: 'Privacy Policy',
              slug: 'privacy',
              content: `Last updated: June 2026\n\n## 1. Data Collection\nWe collect information you provide directly to us, such as your username, email address, and institutional affiliation when you register for an account. We also automatically collect telemetry data from your sandbox environments, including hardware utilization metrics (GPU/CPU usage) to optimize cluster performance.\n\n## 2. Code and Intellectual Property\nAny code you write, execute, or store within the NeuronLabs Virtual Boxes remains your intellectual property. We do not use your proprietary research or training scripts to train our own base models. However, code executed within shared Sandboxes may be temporarily cached on our distributed nodes.\n\n## 3. Data Security\nWe implement strict security measures to protect your data. All communication with our APIs is encrypted via TLS. Virtual Box environments are completely isolated via hardware-level virtualization, preventing cross-tenant data leakage.`
            },
            {
              title: 'Terms of Service',
              slug: 'terms',
              content: `Last updated: June 2026\n\n## 1. Acceptance of Terms\nBy accessing and using the NeuronLabs platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.\n\n## 2. Acceptable Use\nYou agree to use our Virtual Box environments solely for educational and research purposes. The following activities are strictly prohibited:\n- Cryptocurrency mining\n- Hosting malicious content or launching network attacks\n- Bypassing resource quotas or virtualization boundaries\n- Sharing account credentials with unauthorized users\n\n## 3. Termination\nWe reserve the right to suspend or terminate your access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.`
            }
        ];

        try {
            for (const page of pages) {
                const existing = await strapi.documents('api::page.page').findFirst({
                    filters: { slug: page.slug }
                });
                if (!existing) {
                    await strapi.documents('api::page.page').create({ data: page });
                    console.log('Created page:', page.title);
                }
            }

            // Ensure public read access
            const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
            if (publicRole) {
                const permissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
                    where: { action: { $in: ['api::page.page.find', 'api::page.page.findOne'] }, role: publicRole.id }
                });
                
                if (permissions.length < 2) {
                    await strapi.db.query('plugin::users-permissions.permission').createMany({
                        data: [
                            { action: 'api::page.page.find', role: publicRole.id },
                            { action: 'api::page.page.findOne', role: publicRole.id }
                        ]
                    });
                    console.log('Granted public permissions to Page API');
                }
            }
        } catch (e) {
            console.error('Error seeding pages:', e);
        }

        // Seed Courses
        const dataCourses = require('./courses-seed.js');

        try {
            for (const course of dataCourses) {
                const existingList = await strapi.db.query('api::course.course').findMany({
                    where: { title: course.title }
                });
                
                if (!existingList || existingList.length === 0) {
                    await strapi.documents('api::course.course').create({ data: course, status: 'published' });
                    console.log('Created and published course:', course.title);
                } else {
                    const existing = existingList[0];
                    await strapi.documents('api::course.course').update({
                        documentId: existing.documentId,
                        data: { 
                            uuid: course.uuid,
                            description: course.description,
                            modules: course.modules
                        },
                        status: 'published'
                    });
                    console.log('Updated and published course:', course.title);
                }
            }

            // Ensure public read access for courses
            const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
            if (publicRole) {
                const courseActions = ['api::course.course.find', 'api::course.course.findOne'];
                for (const action of courseActions) {
                    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                        where: { action, role: publicRole.id }
                    });
                    if (!existing) {
                        await strapi.db.query('plugin::users-permissions.permission').create({
                            data: { action, role: publicRole.id }
                        });
                        console.log(`Granted ${action} to public role`);
                    }
                }
                
                // Ensure public read access for sandboxes
                const sandboxActions = ['api::sandbox.sandbox.find', 'api::sandbox.sandbox.findOne'];
                for (const action of sandboxActions) {
                    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                        where: { action, role: publicRole.id }
                    });
                    if (!existing) {
                        await strapi.db.query('plugin::users-permissions.permission').create({
                            data: { action, role: publicRole.id }
                        });
                        console.log(`Granted ${action} to public role`);
                    }
                }
            }
            // Ensure public and authenticated create access for feedback
            const authRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });
            
            for (const role of [publicRole, authRole]) {
                if (role) {
                    const feedbackPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
                        where: { action: 'api::feedback.feedback.create', role: role.id }
                    });
                    if (!feedbackPermission) {
                        await strapi.db.query('plugin::users-permissions.permission').create({
                            data: { action: 'api::feedback.feedback.create', role: role.id }
                        });
                        console.log(`Granted ${role.type} create permission for Feedback API`);
                    }
                }
            }

            // Ensure public permissions for code snippets
            if (publicRole) {
                const snippetActions = [
                    'api::code-snippet.code-snippet.find',
                    'api::code-snippet.code-snippet.findOne',
                    'api::code-snippet.code-snippet.create',
                    'api::code-snippet.code-snippet.update',
                    'api::code-snippet.code-snippet.delete'
                ];
                
                for (const action of snippetActions) {
                    const existingPerm = await strapi.db.query('plugin::users-permissions.permission').findOne({
                        where: { action, role: publicRole.id }
                    });
                    if (!existingPerm) {
                        await strapi.db.query('plugin::users-permissions.permission').create({
                            data: { action, role: publicRole.id }
                        });
                        console.log(`Granted ${action} permission to public role`);
                    }
                }
            }
            
            // Ensure public create access for contact
            if (publicRole) {
                const contactPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
                    where: { action: 'api::contact.contact.create', role: publicRole.id }
                });
                if (!contactPermission) {
                    await strapi.db.query('plugin::users-permissions.permission').create({
                        data: { action: 'api::contact.contact.create', role: publicRole.id }
                    });
                    console.log(`Granted public create permission for Contact API`);
                }
            }
        } catch (e) {
            console.error('Error seeding courses:', e);
        }
    },
};
