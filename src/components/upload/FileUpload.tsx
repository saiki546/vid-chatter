import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export function FileUpload({ onFileUpload, isUploading = false, uploadProgress = 0 }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/', 'audio/'];
      const isValid = validTypes.some(type => file.type.startsWith(type));
      
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video or audio file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a']
    },
    multiple: false,
    disabled: isUploading
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  if (uploadedFile && !isUploading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`upload-zone cursor-pointer ${isDragActive ? 'dragover' : ''} ${
          isUploading ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          {isUploading ? (
            <div className="w-full max-w-sm space-y-2">
              <p className="text-sm font-medium">Uploading...</p>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">
                  {isDragActive ? "Drop your file here" : "Upload Video or Audio"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your file here, or click to browse
                </p>
              </div>
              
              <Button variant="outline">
                <File className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Supports: MP4, AVI, MOV, MP3, WAV, AAC (Max 50MB)
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}