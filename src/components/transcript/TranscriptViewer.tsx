import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, FileText, Copy } from "lucide-react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

interface TranscriptViewerProps {
  transcript: string;
  title?: string;
}

export function TranscriptViewer({ transcript, title = "Video Transcript" }: TranscriptViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const downloadAsTxt = () => {
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`);
    toast({
      title: "Download started",
      description: "Transcript downloaded as TXT file.",
    });
  };

  const downloadAsPdf = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(title, margin, 30);
      
      // Add transcript with text wrapping
      pdf.setFontSize(11);
      const lines = pdf.splitTextToSize(transcript, maxWidth);
      let yPosition = 50;
      
      lines.forEach((line: string) => {
        if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 7;
      });
      
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      toast({
        title: "Download started",
        description: "Transcript downloaded as PDF file.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Transcript copied to your clipboard.",
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="w-4 h-4" />
          View Transcript
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadAsTxt}>
                <FileText className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadAsPdf}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {transcript}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={downloadAsTxt} className="gap-2">
            <FileText className="w-4 h-4" />
            Download TXT
          </Button>
          <Button onClick={downloadAsPdf} className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}