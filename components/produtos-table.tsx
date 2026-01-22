"use client"

import { useState, useEffect } from "react"
import { Edit, Trash, Eye, PenToolIcon as Tool, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import type { ProdutoFiltros } from "./produtos-filtros"
import { listProducts, deleteProduct, type Product } from "@/lib/products"

interface ProdutosTableProps {
  categoria: string | null
  filtros?: ProdutoFiltros
}

// Definir os tipos para ordenação
type OrdenacaoCampo = "name" | "daily_price" | "total_stock" | "available_stock" | null
type OrdenacaoDirecao = "asc" | "desc"

export function ProdutosTable({ categoria, filtros }: ProdutosTableProps) {
  const [produtos, setProdutos] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para controlar a ordenação
  const [ordenacao, setOrdenacao] = useState<{
    campo: OrdenacaoCampo
    direcao: OrdenacaoDirecao
  }>({
    campo: null,
    direcao: "asc",
  })

  // Função para alternar a ordenação quando uma coluna é clicada
  const alternarOrdenacao = (campo: OrdenacaoCampo) => {
    setOrdenacao((prev) => {
      // Se já estiver ordenando por este campo, inverte a direção
      if (prev.campo === campo) {
        return {
          campo,
          direcao: prev.direcao === "asc" ? "desc" : "asc",
        }
      }
      // Caso contrário, ordena por este campo em ordem ascendente
      return {
        campo,
        direcao: "asc",
      }
    })
  }

  // Função para renderizar o ícone de ordenação
  const renderIconeOrdenacao = (campo: OrdenacaoCampo) => {
    if (ordenacao.campo !== campo) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />
    }
    return ordenacao.direcao === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  // Função para carregar produtos do banco de dados
  const carregarProdutos = async () => {
    setIsLoading(true)
    try {
      const produtosData = await listProducts({
        category_id: categoria,
        is_active: filtros?.disponibilidade === "indisponivel" ? false : undefined,
        include_category: true,
      })
      setProdutos(produtosData)
    } catch (err) {
      console.error("Erro ao carregar produtos:", err)
      setError("Não foi possível carregar os produtos. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para excluir um produto
  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await deleteProduct(id)
      if (result.success) {
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso.",
        })
        // Recarregar a lista de produtos
        carregarProdutos()
      } else {
        toast({
          title: "Erro ao excluir produto",
          description: "Não foi possível excluir o produto. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Erro ao excluir produto:", err)
      toast({
        title: "Erro ao excluir produto",
        description: "Ocorreu um erro ao tentar excluir o produto.",
        variant: "destructive",
      })
    }
  }

  // Carregar produtos quando o componente montar ou quando os filtros mudarem
  useEffect(() => {
    carregarProdutos()
  }, [categoria, filtros])

  // Aplicar filtros adicionais no cliente
  let produtosFiltrados = [...produtos]

  // Aplicar filtros avançados se existirem
  if (filtros) {
    // Filtrar por disponibilidade
    if (filtros.disponibilidade === "disponivel") {
      produtosFiltrados = produtosFiltrados.filter((p) => p.available_stock > 0)
    }

    // Filtrar por categorias (se não estiver já filtrado pelo servidor)
    if (filtros.categorias.length > 0 && !categoria) {
      produtosFiltrados = produtosFiltrados.filter((p) => filtros.categorias.includes(p.category_id))
    }

    // Filtrar por valor mínimo
    if (filtros.valorMin !== null) {
      produtosFiltrados = produtosFiltrados.filter((p) => p.daily_price >= filtros.valorMin!)
    }

    // Filtrar por valor máximo
    if (filtros.valorMax !== null) {
      produtosFiltrados = produtosFiltrados.filter((p) => p.daily_price <= filtros.valorMax!)
    }
  }

  // Aplicar ordenação se um campo estiver selecionado
  if (ordenacao.campo) {
    produtosFiltrados = [...produtosFiltrados].sort((a, b) => {
      const valorA = a[ordenacao.campo!]
      const valorB = b[ordenacao.campo!]

      // Comparação para strings (como nome)
      if (typeof valorA === "string" && typeof valorB === "string") {
        return ordenacao.direcao === "asc" ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA)
      }

      // Comparação para números
      return ordenacao.direcao === "asc" ? Number(valorA) - Number(valorB) : Number(valorB) - Number(valorA)
    })
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando produtos...</div>
  }

  if (error) {
    return <div className="flex justify-center p-8 text-destructive">{error}</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagem</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => alternarOrdenacao("name")}
                className="flex items-center p-0 font-medium hover:bg-transparent"
              >
                Nome
                {renderIconeOrdenacao("name")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => alternarOrdenacao("daily_price")}
                className="flex items-center p-0 font-medium hover:bg-transparent"
              >
                Valor Diária
                {renderIconeOrdenacao("daily_price")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => alternarOrdenacao("total_stock")}
                className="flex items-center p-0 font-medium hover:bg-transparent"
              >
                Estoque
                {renderIconeOrdenacao("total_stock")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => alternarOrdenacao("available_stock")}
                className="flex items-center p-0 font-medium hover:bg-transparent"
              >
                Disponível
                {renderIconeOrdenacao("available_stock")}
              </Button>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtosFiltrados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum produto encontrado com os filtros selecionados.
              </TableCell>
            </TableRow>
          ) : (
            produtosFiltrados.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>
                  <Link href={`/produtos/${produto.id}`}>
                    <div className="relative h-10 w-10">
                      <Image
                        src={produto.image_url || "/placeholder.svg?height=40&width=40&query=produto"}
                        alt={produto.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/produtos/${produto.id}`} className="hover:underline">
                    {produto.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{produto.code}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{produto.category?.name || "Sem categoria"}</Badge>
                </TableCell>
                <TableCell>R$ {produto.daily_price.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{produto.total_stock}</TableCell>
                <TableCell>
                  <Badge variant={produto.available_stock > 0 ? "default" : "destructive"}>
                    {produto.available_stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/produtos/${produto.id}`}>
                      <Button variant="outline" size="icon" title="Ver detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/produtos/${produto.id}/editar`}>
                      <Button variant="outline" size="icon" title="Editar produto">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/produtos/${produto.id}/manutencoes`}>
                      <Button variant="outline" size="icon" title="Gerenciar manutenções">
                        <Tool className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-destructive/10 hover:bg-destructive/20">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir produto</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o produto "{produto.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(produto.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
