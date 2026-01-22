"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Package, History, Settings, QrCode } from "lucide-react"
import { ProductUnitsManagement } from "@/components/product-units-management"
import { ProductMaintenance } from "@/components/product-maintenance"
import type { Product } from "@/lib/products"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")

  const handleEdit = () => {
    router.push(`/products/${product.id}/edit`)
  }

  const handleManageImages = () => {
    router.push(`/products/${product.id}/images`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground">
            {product.code} • {product.category?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleManageImages}>
            <Package className="mr-2 h-4 w-4" />
            Gerenciar Imagens
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Produto
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="units">
            <QrCode className="mr-2 h-4 w-4" />
            Unidades
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Settings className="mr-2 h-4 w-4" />
            Manutenções
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-sm">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Código</label>
                  <p className="text-sm font-mono">{product.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                  <p className="text-sm">{product.category?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="text-sm">{product.description || "Sem descrição"}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                  {product.is_featured && <Badge variant="outline">Destaque</Badge>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preços e Estoque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preço Diário</label>
                  <p className="text-sm font-semibold">R$ {product.daily_price.toFixed(2)}</p>
                </div>
                {product.purchase_price && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preço de Compra</label>
                    <p className="text-sm">R$ {product.purchase_price.toFixed(2)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estoque Total</label>
                  <p className="text-sm">{product.total_stock} unidades</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estoque Disponível</label>
                  <p className="text-sm">{product.available_stock} unidades</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.brand && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Marca</label>
                    <p className="text-sm">{product.brand}</p>
                  </div>
                )}
                {product.model && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                    <p className="text-sm">{product.model}</p>
                  </div>
                )}
                {product.color && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cor</label>
                    <p className="text-sm">{product.color}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Peso</label>
                    <p className="text-sm">{product.weight}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dimensões</label>
                    <p className="text-sm">{product.dimensions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{product.notes || "Nenhuma observação"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="units">
          <ProductUnitsManagement productId={product.id} productName={product.name} />
        </TabsContent>

        <TabsContent value="maintenance">
          <ProductMaintenance productId={product.id} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Aluguéis</CardTitle>
              <CardDescription>Histórico completo de aluguéis deste produto</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">Funcionalidade em desenvolvimento</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
