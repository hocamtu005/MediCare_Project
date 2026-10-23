package vn.medicare.api.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import vn.medicare.api.entity.MedicalRecord;

@Service
public class PdfService {

    public byte[] generatePrescriptionPdf(MedicalRecord record) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A5);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            Paragraph title = new Paragraph("MEDICARE - TOA THUOC (PRESCRIPTION)", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            document.add(new Paragraph("Ngay kham: " + record.getCreatedAt().format(formatter), normalFont));
            
            String doctorName = (record.getDoctor() != null) ? record.getDoctor().getFullName() : "N/A";
            document.add(new Paragraph("Bac si phu trach: " + doctorName, normalFont));
            
            document.add(new Paragraph("Ma ho so: " + record.getId(), normalFont));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("CHAN DOAN (Diagnosis):", boldFont));
            document.add(new Paragraph(record.getDiagnosisIcd10() != null ? record.getDiagnosisIcd10() : "N/A", normalFont));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("PHAC DO / DON THUOC (Treatment & Prescription):", boldFont));
            document.add(new Paragraph(record.getPlan() != null ? record.getPlan() : "N/A", normalFont));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo file PDF: " + e.getMessage());
        }
    }
}