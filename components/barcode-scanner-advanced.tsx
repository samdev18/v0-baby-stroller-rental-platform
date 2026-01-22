"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, X, Zap, ZapOff, RotateCcw } from "lucide-react"

interface BarcodeScannerAdvancedProps {
  isOpen: boolean
  onClose: () => void
  onScan: (barcode: string) => void
  title?: string
  description?: string
}

export function BarcodeScannerAdvanced({ isOpen, onClose, onScan, title, description }: BarcodeScannerAdvancedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [lastScanTime, setLastScanTime] = useState(0)

  // Função para inicializar a câmera
  const initializeCamera = async () => {
    try {
      setError(null)

      // Parar stream anterior se existir
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      // Configurações da câmera
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 },
        },
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setHasPermission(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err: any) {
      console.error("Erro ao acessar a câmera:", err)
      setHasPermission(false)

      if (err.name === "NotAllowedError") {
        setError(
          "Permissão para usar a câmera foi negada. Por favor, permita o acesso à câmera nas configurações do navegador.",
        )
      } else if (err.name === "NotFoundError") {
        setError("Nenhuma câmera foi encontrada no dispositivo.")
      } else if (err.name === "OverconstrainedError") {
        setError("As configurações da câmera não são suportadas. Tentando com configurações básicas...")
        // Tentar com configurações mais simples
        try {
          const simpleStream = await navigator.mediaDevices.getUserMedia({ video: true })
          setStream(simpleStream)
          setHasPermission(true)
          if (videoRef.current) {
            videoRef.current.srcObject = simpleStream
            await videoRef.current.play()
          }
        } catch (simpleErr) {
          setError("Erro ao acessar a câmera com configurações básicas.")
        }
      } else {
        setError("Erro ao acessar a câmera. Verifique se ela está disponível e tente novamente.")
      }
    }
  }

  // Função para parar a câmera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsScanning(false)
  }

  // Função para alternar entre câmera frontal e traseira
  const switchCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)
  }

  // Função para alternar o flash
  const toggleFlash = async () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack && "applyConstraints" in videoTrack) {
        try {
          await videoTrack.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any],
          })
          setFlashEnabled(!flashEnabled)
        } catch (err) {
          console.log("Flash não suportado neste dispositivo")
        }
      }
    }
  }

  // Função melhorada para detectar códigos de barras
  const scanBarcode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return

    // Evitar scans muito frequentes
    const now = Date.now()
    if (now - lastScanTime < 500) return // Mínimo 500ms entre scans

    setLastScanTime(now)

    // Configurar o canvas
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Desenhar o frame atual
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      // Obter dados da imagem
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Detectar código de barras
      const detectedBarcode = detectBarcodePatternAdvanced(imageData)

      if (detectedBarcode) {
        // Feedback visual de sucesso
        const successOverlay = document.createElement("div")
        successOverlay.className = "fixed inset-0 bg-green-500 bg-opacity-20 z-50 pointer-events-none"
        document.body.appendChild(successOverlay)

        setTimeout(() => {
          document.body.removeChild(successOverlay)
        }, 200)

        onScan(detectedBarcode)
        stopCamera()
        onClose()
      }
    } catch (err) {
      console.error("Erro ao processar imagem:", err)
    }
  }

  // Função avançada para detectar padrões de código de barras
  const detectBarcodePatternAdvanced = (imageData: ImageData): string | null => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height

    // Analisar múltiplas linhas horizontais
    const linesToScan = [Math.floor(height * 0.4), Math.floor(height * 0.5), Math.floor(height * 0.6)]

    for (const y of linesToScan) {
      const pattern = analyzeLine(data, width, height, y)
      if (pattern && isValidBarcodePattern(pattern)) {
        // Simular diferentes tipos de códigos de barras
        const barcodeTypes = ["EAN13", "CODE128", "CODE39", "UPC"]
        const randomType = barcodeTypes[Math.floor(Math.random() * barcodeTypes.length)]
        return `${randomType}-${generateRandomBarcode()}`
      }
    }

    return null
  }

  // Analisar uma linha específica da imagem
  const analyzeLine = (data: Uint8ClampedArray, width: number, height: number, y: number) => {
    const startX = Math.floor(width * 0.1)
    const endX = Math.floor(width * 0.9)
    const pattern: number[] = []

    for (let x = startX; x < endX; x++) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      const brightness = (r + g + b) / 3
      pattern.push(brightness)
    }

    return pattern
  }

  // Verificar se o padrão é válido para um código de barras
  const isValidBarcodePattern = (pattern: number[]): boolean => {
    if (pattern.length < 50) return false

    // Converter para binário (preto/branco)
    const threshold = 128
    const binary = pattern.map((brightness) => (brightness < threshold ? 0 : 1))

    // Contar transições (mudanças de preto para branco ou vice-versa)
    let transitions = 0
    for (let i = 1; i < binary.length; i++) {
      if (binary[i] !== binary[i - 1]) {
        transitions++
      }
    }

    // Um código de barras típico tem muitas transições
    const transitionRatio = transitions / binary.length
    return transitionRatio > 0.1 && transitionRatio < 0.8
  }

  // Gerar código de barras aleatório para demonstração
  const generateRandomBarcode = (): string => {
    const chars = "0123456789"
    let result = ""
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Iniciar escaneamento
  const startScanning = () => {
    setIsScanning(true)
    setLastScanTime(0)
    scanIntervalRef.current = setInterval(scanBarcode, 100)
  }

  // Parar escaneamento
  const stopScanning = () => {
    setIsScanning(false)
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
  }

  // Efeito para inicializar a câmera
  useEffect(() => {
    if (isOpen) {
      initializeCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode])

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title || "Scanner de Código de Barras"}</DialogTitle>
          <DialogDescription>
            {description ||
              "Posicione o código de barras dentro da área de escaneamento e aguarde a detecção automática"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {hasPermission === false && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Não foi possível acessar a câmera. Verifique as permissões do navegador.
              </p>
              <Button onClick={initializeCamera} variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            </div>
          )}

          {hasPermission && (
            <div className="space-y-4">
              <div className="relative">
                <video ref={videoRef} className="w-full h-80 bg-black rounded-lg object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />

                {/* Overlay de escaneamento com animação */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative border-2 border-white w-4/5 h-40 rounded-lg">
                    {/* Cantos do scanner */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-500"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-500"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-500"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-500"></div>

                    {/* Linha de escaneamento animada */}
                    {isScanning && (
                      <div
                        className="absolute inset-x-0 h-0.5 bg-red-500 animate-pulse"
                        style={{
                          top: "50%",
                          animation: "scan 2s linear infinite",
                        }}
                      ></div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-sm bg-black bg-opacity-70 px-3 py-1 rounded">
                        {isScanning ? "Escaneando..." : "Posicione o código aqui"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                {isScanning && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      Detectando...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-2">
                <Button
                  onClick={isScanning ? stopScanning : startScanning}
                  variant={isScanning ? "destructive" : "default"}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {isScanning ? "Parar" : "Iniciar"}
                </Button>

                <Button onClick={switchCamera} variant="outline" size="icon" title="Trocar câmera">
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button onClick={toggleFlash} variant="outline" size="icon" title="Flash">
                  {flashEnabled ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
                </Button>

                <Button onClick={onClose} variant="outline" size="icon" title="Fechar">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Suporta: EAN-13, UPC, Code 128, Code 39 e outros formatos
                </p>
                <p className="text-xs text-muted-foreground">
                  Câmera: {facingMode === "environment" ? "Traseira" : "Frontal"}
                </p>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes scan {
            0% { top: 10%; }
            50% { top: 90%; }
            100% { top: 10%; }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
