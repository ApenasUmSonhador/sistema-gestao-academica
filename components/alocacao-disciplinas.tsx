"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, CheckCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Alocacao } from "@/lib/types"

export function AlocacaoDisciplinas() {
  const { disciplinas, docentes, cursos, alocacoes, addAlocacao, updateAlocacao } = useStore()

  const [cursoSelecionado, setCursoSelecionado] = useState("")
  const [semestreSelecionado, setSemestreSelecionado] = useState("")
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<any>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [dadosAlocacao, setDadosAlocacao] = useState<Partial<Alocacao>>({
    diasSemana: [],
    horarioInicio: "",
    horarioFim: "",
    cargaHorariaDiaria: 0,
  })

  const disciplinasFiltradas = disciplinas.filter(
    (d) => d.curso === cursoSelecionado && d.semestre === semestreSelecionado,
  )

  const semestresDisponiveis = [...new Set(disciplinas.map((d) => d.semestre))].sort()

  const semestresFiltrados = (curso : any) => {
    if (!curso) return semestresDisponiveis
    const disciplinasDoCurso = disciplinas.filter((d) => d.curso === cursoSelecionado)
    return [...new Set(disciplinasDoCurso.map((d) => d.semestre))].sort()
  }

  const abrirDialogAlocacao = (disciplina: any) => {
    setDisciplinaSelecionada(disciplina)

    // Verificar se já existe alocação para esta disciplina
    const alocacaoExistente = alocacoes.find((a) => a.disciplinaId === disciplina.id)
    if (alocacaoExistente) {
      setDadosAlocacao(alocacaoExistente)
    } else {
      setDadosAlocacao({
        disciplinaId: disciplina.id,
        docenteId: "",
        diasSemana: [],
        horarioInicio: "",
        horarioFim: "",
        cargaHorariaDiaria: 0,
      })
    }

    setDialogAberto(true)
  }

  const calcularCargaHorariaDiaria = (inicio: string, fim: string) => {
    if (!inicio || !fim) return 0

    const [hi, mi] = inicio.split(":").map(Number)
    const [hf, mf] = fim.split(":").map(Number)

    const inicioMin = hi * 60 + mi
    const fimMin = hf * 60 + mf

    return (fimMin - inicioMin) / 60
  }

  const calcularTotalHoras = () => {
    if (
      !dadosAlocacao.diasSemana?.length ||
      !dadosAlocacao.cargaHorariaDiaria
    ) {
      return 0
    }

    const ch_diaria = dadosAlocacao.cargaHorariaDiaria
    const dias_semana = dadosAlocacao.diasSemana.length

    return 16 * ch_diaria * dias_semana
  }

  const salvarAlocacao = () => {
    if (!dadosAlocacao.docenteId || !dadosAlocacao.diasSemana?.length) {
      return
    }

    const alocacaoExistente = alocacoes.find((a) => a.disciplinaId === disciplinaSelecionada.id)

    if (alocacaoExistente) {
      updateAlocacao(alocacaoExistente.id, dadosAlocacao)
    } else {
      const novaAlocacao: Alocacao = {
        id: `alocacao_${Date.now()}`,
        disciplinaId: disciplinaSelecionada.id,
        docenteId: dadosAlocacao.docenteId!,
        diasSemana: dadosAlocacao.diasSemana!,
        horarioInicio: dadosAlocacao.horarioInicio!,
        horarioFim: dadosAlocacao.horarioFim!,
        cargaHorariaDiaria: dadosAlocacao.cargaHorariaDiaria!,
      }
      addAlocacao(novaAlocacao)
    }

    setDialogAberto(false)
  }

  const handleDiaSemanaChange = (dia: string, checked: boolean) => {
    const diasAtuais = dadosAlocacao.diasSemana || []
    if (checked) {
      setDadosAlocacao({
        ...dadosAlocacao,
        diasSemana: [...diasAtuais, dia],
      })
    } else {
      setDadosAlocacao({
        ...dadosAlocacao,
        diasSemana: diasAtuais.filter((d) => d !== dia),
      })
    }
  }

  const handleHorarioChange = (campo: "horarioInicio" | "horarioFim", valor: string) => {
    const novosDados = { ...dadosAlocacao, [campo]: valor }

    if (novosDados.horarioInicio && novosDados.horarioFim) {
      novosDados.cargaHorariaDiaria = calcularCargaHorariaDiaria(novosDados.horarioInicio, novosDados.horarioFim)
    }

    setDadosAlocacao(novosDados)
  }

  const totalHorasCalculado = calcularTotalHoras()
  const divergenciaCH = disciplinaSelecionada ? Math.abs(totalHorasCalculado - disciplinaSelecionada.ch) : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Seleção</CardTitle>
          <CardDescription>Selecione o curso e semestre para visualizar as disciplinas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Select value={cursoSelecionado} onValueChange={setCursoSelecionado}>
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
              <Select value={semestreSelecionado} onValueChange={setSemestreSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semestresFiltrados(cursoSelecionado).map((semestre) => (
                    <SelectItem key={semestre} value={semestre}>
                      {semestre}º Semestre
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {cursoSelecionado && semestreSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle>
              Disciplinas - {cursoSelecionado} - {semestreSelecionado}º Semestre
            </CardTitle>
            <CardDescription>Clique em "Alocar Horário" para definir horários e docentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>CH</TableHead>
                  <TableHead>Natureza</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplinasFiltradas.map((disciplina) => {
                  const alocacao = alocacoes.find((a) => a.disciplinaId === disciplina.id)
                  const docente = alocacao ? docentes.find((d) => d.id === alocacao.docenteId) : null

                  return (
                    <TableRow key={disciplina.id}>
                      <TableCell className="font-mono">{disciplina.codigo}</TableCell>
                      <TableCell className="font-medium">{disciplina.componenteCurricular}</TableCell>
                      <TableCell>{disciplina.ch}h</TableCell>
                      <TableCell>
                        <Badge variant={disciplina.natureza === "OBRIGATÓRIA" ? "default" : "secondary"}>
                          {disciplina.natureza}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {alocacao ? (
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Alocada
                            </Badge>
                            {docente && <div className="text-xs text-gray-600">{docente.nome}</div>}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => abrirDialogAlocacao(disciplina)}>
                          {alocacao ? "Editar" : "Alocar"} Horário
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Alocar Horário - {disciplinaSelecionada?.componenteCurricular}
            </DialogTitle>
            <DialogDescription>
              Código: {disciplinaSelecionada?.codigo} | CH: {disciplinaSelecionada?.ch}h
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="docente">Docente</Label>
              <Select
                value={dadosAlocacao.docenteId}
                onValueChange={(value) => setDadosAlocacao({ ...dadosAlocacao, docenteId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o docente" />
                </SelectTrigger>
                <SelectContent>
                  {docentes.map((docente) => (
                    <SelectItem key={docente.id} value={docente.id}>
                      {docente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dias da Semana</Label>
              <div className="grid grid-cols-3 gap-2">
                {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map((dia) => (
                  <div key={dia} className="flex items-center space-x-2">
                    <Checkbox
                      id={dia}
                      checked={dadosAlocacao.diasSemana?.includes(dia)}
                      onCheckedChange={(checked) => handleDiaSemanaChange(dia, checked as boolean)}
                    />
                    <Label htmlFor={dia} className="text-sm">
                      {dia}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horarioInicio">Horário Início</Label>
                <Input
                  id="horarioInicio"
                  type="time"
                  value={dadosAlocacao.horarioInicio}
                  onChange={(e) => handleHorarioChange("horarioInicio", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioFim">Horário Fim</Label>
                <Input
                  id="horarioFim"
                  type="time"
                  value={dadosAlocacao.horarioFim}
                  onChange={(e) => handleHorarioChange("horarioFim", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargaHorariaDiaria">CH Diária</Label>
                <Input
                  id="cargaHorariaDiaria"
                  type="number"
                  step="0.5"
                  value={dadosAlocacao.cargaHorariaDiaria}
                  onChange={(e) =>
                    setDadosAlocacao({ ...dadosAlocacao, cargaHorariaDiaria: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>

            {totalHorasCalculado > 0 && (
              <Alert className={divergenciaCH > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
                <Clock className={`h-4 w-4 ${divergenciaCH > 0 ? "text-orange-600" : "text-green-600"}`} />
                <AlertDescription className={divergenciaCH > 0 ? "text-orange-800" : "text-green-800"}>
                  <div className="space-y-1">
                    <div>Total de horas calculado: {totalHorasCalculado}h</div>
                    <div>Carga horária da disciplina: {disciplinaSelecionada?.ch}h</div>
                    {divergenciaCH > 0 && (
                      <div className="font-medium">⚠️ Divergência de {divergenciaCH}h detectada!</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarAlocacao}>Salvar Alocação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
