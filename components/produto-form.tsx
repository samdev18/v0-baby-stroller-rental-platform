"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { createProduct, updateProduct, uploadProductImage, type Product, type ProductCategory } from "@/lib/products"

interface ProdutoFormProps {
  id?: string
  produto?: Product
  categorias: ProductCategory[]
}

export function ProdutoForm({ id, produto, categorias }: ProdutoFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagemPreview, setImagemPreview] = useState<string | null>(produto?.image_url || null)
  const [imagemFile, setImagemFile] = useState<File | null>(null)

  // Estados para os campos do formulário
  const [nome, setNome] = useState(produto?.name || "")
  const [categoriaId, setCategoriaId] = useState(produto?.category_id || categorias[0]?.id || "")
  const [descricao, setDescricao] = useState(produto?.description || "")
  const [valorDiaria, setValorDiaria] = useState(produto?.daily_price.toString() || "")
  const [valorCompra, setValorCompra] = useState(produto?.purchase_price?.toString() || "")
  const [estoque, setEstoque] = useState(produto?.total_stock.toString() || "1")
  const [disponivel, setDisponivel] = useState(produto?.available_stock.toString() || "1")
  const [marca, setMarca] = useState(produto?.brand || "")
  const [modelo, setModelo] = useState(produto?.model || "")
  const [cor, setCor] = useState(produto?.color || "")
  const [peso, setPeso] = useState(produto?.weight || "")
  const [dimensoes, setDimensoes] = useState(produto?.dimensions || "")
  const [observacoes, setObservacoes] = useState(produto?.notes || "")
  const [ativo, setAtivo] = useState(produto?.is_active !== false)
  const [destaque, setDestaque] = useState(produto?.is_featured || false)

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagemFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload da imagem se houver uma nova
      let imageUrl = produto?.image_url || null
      if (imagemFile) {
        const uploadResult = await uploadProductImage(imagemFile)
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url
        } else {
          toast({
            title: "Erro ao fazer upload da imagem",
            description: "Não foi possível fazer o upload da imagem. O produto será salvo sem imagem.",
            variant: "destructive",
          })
        }
      }

      // Preparar dados do produto
      const produtoData = {
        name: nome,
        category_id: categoriaId,
        description: descricao || null,
        daily_price: Number.parseFloat(valorDiaria),
        purchase_price: valorCompra ? Number.parseFloat(valorCompra) : null,
        total_stock: Number.parseInt(estoque),
        available_stock: Number.parseInt(disponivel),
        image_url: imageUrl,
        brand: marca || null,
        model: modelo || null,
        color: cor || null,
        weight: peso || null,
        dimensions: dimensoes || null,
        notes: observacoes || null,
        is_active: ativo,
        is_featured: destaque,
      }

      let result
      if (id) {
        // Atualizar produto existente
        result = await updateProduct(id, produtoData)
        if (result.success) {
          toast({
            title: "Produto atualizado",
            description: "O produto foi atualizado com sucesso.",
          })
          router.push(`/produtos/${id}`)
        }
      } else {
        // Criar novo produto
        result = await createProduct(produtoData)
        if (result.success) {
          toast({
            title: "Produto cadastrado",
            description: "O produto foi cadastrado com sucesso.",
          })
          router.push(`/produtos/${result.id}`)
        }
      }

      if (!result?.success) {
        throw new Error("Erro ao salvar produto")
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      toast({
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao tentar salvar o produto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto</Label>
            <Input
              id="nome"
              placeholder="Nome do produto"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={categoriaId} onValueChange={(value) => setCategoriaId(value)}>
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o produto"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="valorDiaria">Valor da Diária (R$)</Label>
              <Input
                id="valorDiaria"
                type="number"
                min="0"
                step="0.01"
                required
                value={valorDiaria}
                onChange={(e) => setValorDiaria(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorCompra">Valor de Compra (R$)</Label>
              <Input
                id="valorCompra"
                type="number"
                min="0"
                step="0.01"
                value={valorCompra}
                onChange={(e) => setValorCompra(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="estoque">Quantidade em Estoque</Label>
              <Input
                id="estoque"
                type="number"
                min="0"
                required
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disponivel">Quantidade Disponível</Label>
              <Input
                id="disponivel"
                type="number"
                min="0"
                required
                value={disponivel}
                onChange={(e) => setDisponivel(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                {imagemPreview ? (
                  <Image
                    src={imagemPreview || "/placeholder.svg"}
                    alt="Preview da imagem"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex w-full flex-col gap-2">
                <Input id="imagem" type="file" accept="image/*" onChange={handleImagemChange} />
                <p className="text-xs text-muted-foreground">Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                placeholder="Marca do produto"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                placeholder="Modelo do produto"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <Input id="cor" placeholder="Cor" value={cor} onChange={(e) => setCor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input id="peso" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensoes">Dimensões (cm)</Label>
              <Input
                id="dimensoes"
                placeholder="CxLxA"
                value={dimensoes}
                onChange={(e) => setDimensoes(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
          <Label htmlFor="ativo">Produto ativo</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="destaque" checked={destaque} onCheckedChange={setDestaque} />
          <Label htmlFor="destaque">Produto em destaque</Label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/produtos")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {id ? "Salvar Alterações" : "Cadastrar Produto"}
        </Button>
      </div>
    </form>
  )
}
