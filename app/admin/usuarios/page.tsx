"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, UserPlus, Shield, ShieldAlert, UserX } from "lucide-react"
import { listUsers, type Profile } from "@/lib/profile"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseClient } from "@/lib/supabase"

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true)
      const usersData = await listUsers()
      setUsers(usersData)
      setIsLoading(false)
    }

    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: "admin" } : user)))

      toast({
        title: "Usuário promovido",
        description: "O usuário agora é um administrador.",
      })
    } catch (error) {
      toast({
        title: "Erro ao promover usuário",
        description: "Não foi possível promover o usuário a administrador.",
        variant: "destructive",
      })
    }
  }

  const handleDemoteToUser = async (userId: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ role: "user" }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: "user" } : user)))

      toast({
        title: "Permissão removida",
        description: "O usuário não é mais um administrador.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover permissão",
        description: "Não foi possível remover as permissões de administrador.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">Administre os usuários do sistema</p>
        </div>
        <Button onClick={() => router.push("/admin/usuarios/novo")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Total de {users.length} usuários registrados no sistema</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "Nenhum usuário encontrado com os termos da busca." : "Nenhum usuário cadastrado."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "Sem nome"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                          <Shield className="mr-1 h-3 w-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">Usuário</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Gerenciar Usuário</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/admin/usuarios/${user.id}`)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          {user.role === "admin" ? (
                            <DropdownMenuItem onClick={() => handleDemoteToUser(user.id)}>
                              <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                              Remover admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id)}>
                              <Shield className="mr-2 h-4 w-4 text-amber-500" />
                              Tornar admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <UserX className="mr-2 h-4 w-4" />
                            Desativar conta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
