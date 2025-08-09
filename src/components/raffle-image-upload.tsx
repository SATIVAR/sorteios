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
import { cn } from "@/lib/utils";

type AspectRatio = '1:1' | '16:9';

interface RaffleImageUploadProps {
  value?: string | null;
  aspectRatio?: AspectRatio | null;
  onChange: (file: File | null, preview: string | null, aspectRatio: AspectRatio | null) => void;
  className?: string;
}

export function RaffleImageUpload({ value, aspectRatio, onChange, className }: RaffleImageUploadProps) {
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio | null>(aspectRatio || null);
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
    if (!imageSrc || !croppedAreaPixels || !imageFile || !selectedAspectRatio) return;
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const result = reader.result as string;
          setCroppedImage(result);
          onChange(imageFile, result, selectedAspectRatio);
        });
        reader.readAsDataURL(croppedImageBlob);
      }
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, imageFile, selectedAspectRatio, onChange]);

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setImageFile(null);
    setSelectedAspectRatio(null);
    onChange(null, null, null);
  };

  const handleChangeImage = () => {
    document.getElementById('raffle-image-upload-input')?.click();
  };

  const handleAspectRatioSelect = (ratio: AspectRatio) => {
    setSelectedAspectRatio(ratio);
  };

  const getAspectRatioValue = (ratio: AspectRatio): number => {
    return ratio === '1:1' ? 1 : 16/9;
  };

  const canUploadImage = selectedAspectRatio !== null;

  return (
    <>
      <div className={className}>
        {croppedImage ? (
          <div className="space-y-4 p-4">
            <div className={cn(
              "relative mx-auto border-2 border-border rounded-lg overflow-hidden",
              selectedAspectRatio === '1:1' ? "w-32 h-32" : "w-48 h-28"
            )}>
              <Image 
                src={croppedImage} 
                alt="Imagem do sorteio" 
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Proporção: {selectedAspectRatio === '1:1' ? 'Quadrado (1:1)' : 'Retangular (16:9)'}
              </p>
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
          <div className="space-y-4">
            {/* Aspect Ratio Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Escolha a proporção da imagem:</h4>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedAspectRatio === '1:1' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAspectRatioSelect('1:1')}
                  className="flex-1"
                >
                  Quadrado (1:1)
                </Button>
                <Button
                  type="button"
                  variant={selectedAspectRatio === '16:9' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAspectRatioSelect('16:9')}
                  className="flex-1"
                >
                  Retangular (16:9)
                </Button>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors p-6",
                canUploadImage 
                  ? "border-border cursor-pointer bg-muted/50 hover:bg-muted" 
                  : "border-muted-foreground/25 bg-muted/25 cursor-not-allowed"
              )}
              onClick={canUploadImage ? () => document.getElementById('raffle-image-upload-input')?.click() : undefined}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className={cn(
                  "w-12 h-12 mb-4",
                  canUploadImage ? "text-muted-foreground" : "text-muted-foreground/50"
                )} />
                <p className={cn(
                  "mb-2 text-sm font-medium",
                  canUploadImage ? "text-muted-foreground" : "text-muted-foreground/50"
                )}>
                  {canUploadImage 
                    ? "Arraste e solte ou clique para enviar" 
                    : "Primeiro selecione uma proporção"
                  }
                </p>
                <p className={cn(
                  "text-xs",
                  canUploadImage ? "text-muted-foreground" : "text-muted-foreground/50"
                )}>
                  PNG ou JPG (Recomendado: {selectedAspectRatio === '1:1' ? '500x500px' : '1920x1080px'})
                </p>
              </div>
            </div>
          </div>
        )}
        <Input 
          id="raffle-image-upload-input" 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={!canUploadImage}
        />
      </div>

      {imageSrc && selectedAspectRatio && (
        <Dialog open={!!imageSrc} onOpenChange={() => setImageSrc(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cortar Imagem - {selectedAspectRatio === '1:1' ? 'Quadrado' : 'Retangular'}</DialogTitle>
            </DialogHeader>
            <DialogBody className="p-0">
              <div className="relative w-full h-64">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={getAspectRatioValue(selectedAspectRatio)}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid={true}
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button onClick={() => setImageSrc(null)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={showCroppedImage}>
                Confirmar Corte
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}