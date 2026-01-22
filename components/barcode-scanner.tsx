"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (code: string) => void
  onError?: (error: string) => void
}

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup: stop stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()

        // Start scanning after video is loaded
        videoRef.current.onloadedmetadata = () => {
          scanForBarcode()
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      const errorMessage = "Erro ao acessar a câmera. Verifique as permissões."
      setError(errorMessage)
      onError?.(errorMessage)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const scanForBarcode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      setTimeout(scanForBarcode, 100)
      return
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for barcode detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // Simple barcode detection (this is a basic implementation)
    // In a real app, you'd use a proper barcode detection library
    const detectedCode = detectBarcode(imageData)

    if (detectedCode) {
      onScan(detectedCode)
      stopScanning()
      return
    }

    // Continue scanning
    if (isScanning) {
      setTimeout(scanForBarcode, 100)
    }
  }

  // Basic barcode detection (placeholder implementation)
  const detectBarcode = (imageData: ImageData): string | null => {
    // This is a simplified barcode detection
    // In a real implementation, you'd use a library like @zxing/library

    // For demo purposes, we'll simulate detection after a few seconds
    // and return a sample barcode
    const now = Date.now()
    const scanStartTime = now - 3000 // Simulate 3 seconds of scanning

    if (Math.random() > 0.95) {
      // 5% chance of "detecting" a barcode each scan
      return `DEMO-${now.toString().slice(-8)}`
    }

    return null
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {isScanning ? (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-white border-dashed w-64 h-32 flex items-center justify-center">
                <div className="text-white text-sm text-center">
                  <div className="animate-pulse">Escaneando...</div>
                  <div className="text-xs mt-1">Posicione o código aqui</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm opacity-75">Clique em "Iniciar Scanner" para começar</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-2 justify-center">
        {!isScanning ? (
          <Button onClick={startScanning} className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Iniciar Scanner
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="outline" className="flex items-center gap-2">
            <CameraOff className="h-4 w-4" />
            Parar Scanner
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        <p>• Permita o acesso à câmera quando solicitado</p>
        <p>• Posicione o código de barras dentro da área marcada</p>
        <p>• Mantenha o código bem iluminado e focado</p>
      </div>
    </div>
  )
}
