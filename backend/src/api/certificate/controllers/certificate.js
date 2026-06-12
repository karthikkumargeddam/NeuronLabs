'use strict';

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

module.exports = {
  async generate(ctx) {
    try {
      const { studentName, courseName } = ctx.request.body;

      if (!studentName || !courseName) {
        return ctx.badRequest('Missing studentName or courseName');
      }

      // Create a new PDFDocument
      const pdfDoc = await PDFDocument.create();
      
      // Add a blank page (Landscape, Letter size)
      const page = pdfDoc.addPage([792, 612]);
      const { width, height } = page.getSize();

      // Embed standard fonts
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Draw Background Border
      page.drawRectangle({
        x: 30,
        y: 30,
        width: width - 60,
        height: height - 60,
        borderColor: rgb(0.1, 0.4, 0.7),
        borderWidth: 5,
      });

      // Title
      const title = 'CERTIFICATE OF COMPLETION';
      const titleWidth = timesRomanBoldFont.widthOfTextAtSize(title, 40);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y: height - 120,
        size: 40,
        font: timesRomanBoldFont,
        color: rgb(0.1, 0.2, 0.4),
      });

      // Subtitle
      const subtitle = 'This is to certify that';
      const subtitleWidth = helveticaFont.widthOfTextAtSize(subtitle, 20);
      page.drawText(subtitle, {
        x: (width - subtitleWidth) / 2,
        y: height - 200,
        size: 20,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Student Name
      const nameWidth = timesRomanBoldFont.widthOfTextAtSize(studentName, 45);
      page.drawText(studentName, {
        x: (width - nameWidth) / 2,
        y: height - 280,
        size: 45,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });

      // Course statement
      const statement = `has successfully completed the course`;
      const statementWidth = helveticaFont.widthOfTextAtSize(statement, 20);
      page.drawText(statement, {
        x: (width - statementWidth) / 2,
        y: height - 360,
        size: 20,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Course Name
      const courseWidth = timesRomanBoldFont.widthOfTextAtSize(courseName, 30);
      page.drawText(courseName, {
        x: (width - courseWidth) / 2,
        y: height - 420,
        size: 30,
        font: timesRomanBoldFont,
        color: rgb(0.1, 0.4, 0.7),
      });

      // Date
      const dateString = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const dateText = `Date: ${dateString}`;
      page.drawText(dateText, {
        x: 100,
        y: 100,
        size: 16,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Signature line placeholder
      page.drawLine({
        start: { x: width - 250, y: 120 },
        end: { x: width - 100, y: 120 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      page.drawText('Instructor Signature', {
        x: width - 230,
        y: 100,
        size: 14,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();

      // Return the PDF to the client
      ctx.set('Content-Type', 'application/pdf');
      ctx.set('Content-Disposition', `attachment; filename="${studentName.replace(/\\s+/g, '_')}_Certificate.pdf"`);
      ctx.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error('Certificate Generation Error:', error);
      return ctx.internalServerError('Failed to generate certificate');
    }
  }
};
