"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, BookOpen, Users, GraduationCap } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Docente, Curso } from "@/lib/types"

export function GerenciamentoEntidades() {
  const {
    disciplinas,
    docentes,
    cursos,
    addDisciplina,
    addDocente,
    addCurso,
    updateDisciplina,
    updateDocente,
    updateCurso,
    removeDisciplina,
    removeDocente,
    removeCurso,
  } = useStore()

  const [dialogAberto, setDialogAberto] = useState(false)
  const [tipoEntidade, setTipoEntidade] = useState<"disciplina" | "docente" | "curso">("disciplina")
  const [entidadeEditando, setEntidadeEditando] = useState<any>(null)

  const abrirDialog = (tipo: "disciplina" | "docente" | "curso", entidade?: any) => {
    setTipoEntidade(tipo)
    setEntidadeEditando(entidade || null)
    setDialogAberto(true)
  }

  const salvarEntidade = (dados: any) => {
    if (entidadeEditando) {
      // Editar
      if (tipoEntidade === "disciplina") {
        updateDisciplina(entidadeEditando.id, dados)
      } else if (tipoEntidade === "docente") {
        updateDocente(entidadeEditando.id, dados)
      } else if (tipoEntidade === "curso") {
        updateCurso(entidadeEditando.id, dados)
      }
    } else {
      // Adicionar
      const novaEntidade = {
        ...dados,
        id: `${tipoEntidade}_${Date.now()}`,
      }

      if (tipoEntidade === "disciplina") {
        addDisciplina(novaEntidade)
      } else if (tipoEntidade === "docente") {
        addDocente(novaEntidade)
      } else if (tipoEntidade === "curso") {
        addCurso(novaEntidade)
      }
    }

    setDialogAberto(false)
    setEntidadeEditando(null)
  }

  const removerEntidade = (id: string, tipo: "disciplina" | "docente" | "curso") => {
    if (tipo === "disciplina") {
      removeDisciplina(id)
    } else if (tipo === "docente") {
      removeDocente(id)
    } else if (tipo === "curso") {
      removeCurso(id)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="disciplinas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disciplinas" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Disciplinas ({disciplinas.length})
          </TabsTrigger>
          <TabsTrigger value="docentes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Docentes ({docentes.length})
          </TabsTrigger>
          <TabsTrigger value="cursos" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Cursos ({cursos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disciplinas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Disciplinas</CardTitle>
                <CardDescription>Gerencie as disciplinas do curso</CardDescription>
              </div>
              <Button onClick={() => abrirDialog("disciplina")}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Disciplina
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>CH</TableHead>
                    <TableHead>Natureza</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplinas.map((disciplina) => (
                    <TableRow key={disciplina.id}>
                      <TableCell className="font-mono">{disciplina.codigo}</TableCell>
                      <TableCell className="font-medium">{disciplina.componenteCurricular}</TableCell>
                      <TableCell>{disciplina.curso}</TableCell>
                      <TableCell>{disciplina.semestre}</TableCell>
                      <TableCell>{disciplina.ch}h</TableCell>
                      <TableCell>
                        <Badge variant={disciplina.natureza === "OBRIGATÓRIA" ? "default" : "secondary"}>
                          {disciplina.natureza}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => abrirDialog("disciplina", disciplina)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removerEntidade(disciplina.id, "disciplina")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docentes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Docentes</CardTitle>
                <CardDescription>Gerencie os professores</CardDescription>
              </div>
              <Button onClick={() => abrirDialog("docente")}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Docente
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docentes.map((docente) => (
                    <TableRow key={docente.id}>
                      <TableCell className="font-medium">{docente.nome}</TableCell>
                      <TableCell>{docente.email || "-"}</TableCell>
                      <TableCell>{docente.especialidade || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => abrirDialog("docente", docente)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => removerEntidade(docente.id, "docente")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cursos</CardTitle>
                <CardDescription>Gerencie os cursos disponíveis</CardDescription>
              </div>
              <Button onClick={() => abrirDialog("curso")}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Curso
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cursos.map((curso) => (
                    <TableRow key={curso.id}>
                      <TableCell className="font-medium">{curso.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{curso.turno}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => abrirDialog("curso", curso)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => removerEntidade(curso.id, "curso")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FormularioEntidade
        aberto={dialogAberto}
        onClose={() => setDialogAberto(false)}
        tipo={tipoEntidade}
        entidade={entidadeEditando}
        onSalvar={salvarEntidade}
        cursos={cursos}
        docentes={docentes}
      />
    </div>
  )
}

interface FormularioEntidadeProps {
  aberto: boolean
  onClose: () => void
  tipo: "disciplina" | "docente" | "curso"
  entidade?: any
  onSalvar: (dados: any) => void
  cursos: Curso[]
  docentes: Docente[]
}

function FormularioEntidade({ aberto, onClose, tipo, entidade, onSalvar, cursos, docentes }: FormularioEntidadeProps) {
  const [dados, setDados] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSalvar(dados)
    setDados({})
  }

  const renderFormulario = () => {
    if (tipo === "disciplina") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={dados.codigo || entidade?.codigo || ""}
                onChange={(e) => setDados({ ...dados, codigo: e.target.value })}
                placeholder="IEF0178"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ch">Carga Horária</Label>
              <Input
                id="ch"
                type="number"
                value={dados.ch || entidade?.ch || ""}
                onChange={(e) => setDados({ ...dados, ch: Number.parseInt(e.target.value) })}
                placeholder="60"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="componenteCurricular">Nome da Disciplina</Label>
            <Input
              id="componenteCurricular"
              value={dados.componenteCurricular || entidade?.componenteCurricular || ""}
              onChange={(e) => setDados({ ...dados, componenteCurricular: e.target.value })}
              placeholder="Pedagogia do Esporte"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Select
                value={dados.curso || entidade?.curso || ""}
                onValueChange={(value) => setDados({ ...dados, curso: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.id} value={curso.nome}>
                      {curso.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semestre">Semestre</Label>
              <Input
                id="semestre"
                value={dados.semestre || entidade?.semestre || ""}
                onChange={(e) => setDados({ ...dados, semestre: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="natureza">Natureza</Label>
            <Select
              value={dados.natureza || entidade?.natureza || ""}
              onValueChange={(value) => setDados({ ...dados, natureza: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a natureza" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OBRIGATÓRIA">OBRIGATÓRIA</SelectItem>
                <SelectItem value="OPTATIVA">OPTATIVA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }

    if (tipo === "docente") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={dados.nome || entidade?.nome || ""}
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              placeholder="Nome completo do docente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={dados.email || entidade?.email || ""}
              onChange={(e) => setDados({ ...dados, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input
              id="especialidade"
              value={dados.especialidade || entidade?.especialidade || ""}
              onChange={(e) => setDados({ ...dados, especialidade: e.target.value })}
              placeholder="Área de especialização"
            />
          </div>
        </div>
      )
    }

    if (tipo === "curso") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Curso</Label>
            <Input
              id="nome"
              value={dados.nome || entidade?.nome || ""}
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              placeholder="LICENCIATURA (DIURNO)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="turno">Turno</Label>
            <Select
              value={dados.turno || entidade?.turno || ""}
              onValueChange={(value) => setDados({ ...dados, turno: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIURNO">DIURNO</SelectItem>
                <SelectItem value="VESPERTINO">VESPERTINO</SelectItem>
                <SelectItem value="NOTURNO">NOTURNO</SelectItem>
                <SelectItem value="VESPERTINO-NOTURNO">VESPERTINO-NOTURNO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {entidade ? "Editar" : "Nova"}{" "}
            {tipo === "disciplina" ? "Disciplina" : tipo === "docente" ? "Docente" : "Curso"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {entidade ? "editar" : "adicionar"}{" "}
            {tipo === "disciplina" ? "a disciplina" : tipo === "docente" ? "o docente" : "o curso"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {renderFormulario()}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{entidade ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
