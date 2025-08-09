"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UploadCloud, X, Edit3 } from "lucide-react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/crop-image";
import Image from "next/image";

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File | null, preview: string | null) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(value || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels || !imageFile) return;
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const result = reader.result as string;
          setCroppedImage(result);
          onChange(imageFile, result);
        });
        reader.readAsDataURL(croppedImageBlob);
      }
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, imageFile, onChange]);

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setImageFile(null);
    onChange(null, null);
  };

  const handleChangeImage = () => {
    document.getElementById('image-upload-input')?.click();
  };

  return (
    <>
      <div className={className}>
        {croppedImage ? (
          <div className="space-y-4 p-4">
            <div className="relative w-32 h-32 mx-auto">
              <Image 
                src={croppedImage} 
                alt="Logo preview" 
                fill
                className="object-cover rounded-lg border-2 border-border"
              />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleChangeImage}
                className="flex items-center gap-2 w-full justify-center"
              >
                <Edit3 className="w-4 h-4" />
                Alterar Imagem
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="flex items-center gap-2 text-destructive hover:text-destructive w-full justify-center"
              >
                <X className="w-4 h-4" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors p-6"
            onClick={() => document.getElementById('image-upload-input')?.click()}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <UploadCloud className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground font-medium">
                Arraste e solte ou clique para enviar
              </p>
              <p className="text-xs text-muted-foreground">
                PNG ou JPG (Recomendado: 500x500px)
              </p>
            </div>
          </div>
        )}
        <Input 
          id="image-upload-input" 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>

      {imageSrc && (
        <Dialog open={!!imageSrc} onOpenChange={() => setImageSrc(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cortar Imagem</DialogTitle>
            </DialogHeader>
            <DialogBody className="p-0">
              <div className="relative w-full h-64">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setImageSrc(null)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={showCroppedImage}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}