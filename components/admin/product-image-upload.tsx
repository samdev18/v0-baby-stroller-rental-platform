"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadImageToSupabase } from "@/lib/upload-image"

interface ProductImageUploadProps {
  productId: string
  onImageUploaded?: (imageUrl: string) => void
  className?: string
}

export function ProductImageUpload({ productId, onImageUploaded, className = "" }: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (JPG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Verificar tamanho do arquivo (limite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Criar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !productId) return

    setIsUploading(true)

    try {
      console.log("Iniciando upload da imagem...")

      // Upload da imagem para o Supabase e salvar metadados em uma única função
      const imageData = await uploadImageToSupabase(selectedFile, productId, true)

      if (!imageData) {
        throw new Error("Falha ao fazer upload da imagem")
      }

      console.log("Imagem enviada com sucesso, URL:", imageData.url)

      toast({
        title: "Imagem enviada com sucesso",
        description: "A imagem foi adicionada ao produto",
      })

      // Limpar formulário
      setSelectedFile(null)
      setPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      // Callback
      if (onImageUploaded) onImageUploaded(imageData.url)
    } catch (error: any) {
      console.error("Erro ao fazer upload da imagem:", error)
      toast({
        title: "Erro ao enviar imagem",
        description: error.message || "Ocorreu um erro ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        {!preview ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <div className="rounded-full bg-gray-100 p-3">
              <ImageIcon className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Clique para selecionar uma imagem</p>
              <p className="text-xs text-gray-500">JPG, PNG ou GIF até 5MB</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              <button
                onClick={handleCancel}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Enviar Imagem
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
