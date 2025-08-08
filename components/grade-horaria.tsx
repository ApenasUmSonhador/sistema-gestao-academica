"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Calendar, Download, Filter } from "lucide-react"
import { useStore } from "@/lib/store"

export function GradeHoraria() {
  const { disciplinas, docentes, cursos, alocacoes } = useStore()

  const [filtroTipo, setFiltroTipo] = useState<"curso" | "docente" | "geral">("curso")
  const [cursoSelecionado, setCursoSelecionado] = useState("")
  const [semestreSelecionado, setSemestreSelecionado] = useState("")
  const [docenteSelecionado, setDocenteSelecionado] = useState("")

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const horarios = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ]

  const semestresDisponiveis = [...new Set(disciplinas.map((d) => d.semestre))].sort()

  const obterAlocacoesFiltradas = () => {
    let alocacoesFiltradas = alocacoes

    if (filtroTipo === "curso" && cursoSelecionado && semestreSelecionado) {
      const disciplinasFiltradasIds = disciplinas
        .filter((d) => d.curso === cursoSelecionado && d.semestre === semestreSelecionado)
        .map((d) => d.id)
      alocacoesFiltradas = alocacoes.filter((a) => disciplinasFiltradasIds.includes(a.disciplinaId))
    } else if (filtroTipo === "docente" && docenteSelecionado) {
      alocacoesFiltradas = alocacoes.filter((a) => a.docenteId === docenteSelecionado)
    }

    return alocacoesFiltradas
  }

  const verificarConflito = (dia: string, horario: string) => {
    const alocacoesFiltradas = obterAlocacoesFiltradas()

    return alocacoesFiltradas.filter((alocacao) => {
      if (!alocacao.diasSemana.includes(dia)) return false

      const [horaInicio, minInicio] = alocacao.horarioInicio.split(":").map(Number)
      const [horaFim, minFim] = alocacao.horarioFim.split(":").map(Number)
      const [horaAtual] = horario.split(":").map(Number)

      return horaAtual >= horaInicio && horaAtual < horaFim
    })
  }

  const obterDisciplinaPorAlocacao = (alocacaoId: string) => {
    const alocacao = alocacoes.find((a) => a.id === alocacaoId)
    if (!alocacao) return null
    return disciplinas.find((d) => d.id === alocacao.disciplinaId)
  }

  const obterDocentePorAlocacao = (alocacaoId: string) => {
    const alocacao = alocacoes.find((a) => a.id === alocacaoId)
    if (!alocacao) return null
    return docentes.find((d) => d.id === alocacao.docenteId)
  }

  const exportarGrade = () => {
    // Funcionalidade de exportação seria implementada aqui
    alert("Funcionalidade de exportação será implementada")
  }

  const alocacoesFiltradas = obterAlocacoesFiltradas()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Visualização
          </CardTitle>
          <CardDescription>Configure os filtros para visualizar a grade horária</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipoFiltro">Tipo de Visualização</Label>
              <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de filtro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="curso">Por Curso e Semestre</SelectItem>
                  <SelectItem value="docente">Por Docente</SelectItem>
                  <SelectItem value="geral">Visualização Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtroTipo === "curso" && (
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
                      {semestresDisponiveis.map((semestre) => (
                        <SelectItem key={semestre} value={semestre}>
                          {semestre}º Semestre
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {filtroTipo === "docente" && (
              <div className="space-y-2">
                <Label htmlFor="docente">Docente</Label>
                <Select value={docenteSelecionado} onValueChange={setDocenteSelecionado}>
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
            )}

            <div className="flex justify-end">
              <Button onClick={exportarGrade} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Grade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Grade Horária
            {filtroTipo === "curso" && cursoSelecionado && semestreSelecionado && (
              <Badge variant="outline">
                {cursoSelecionado} - {semestreSelecionado}º Semestre
              </Badge>
            )}
            {filtroTipo === "docente" && docenteSelecionado && (
              <Badge variant="outline">{docentes.find((d) => d.id === docenteSelecionado)?.nome}</Badge>
            )}
          </CardTitle>
          <CardDescription>Visualização da grade horária com as disciplinas alocadas</CardDescription>
        </CardHeader>
        
        <CardContent>
          
          {alocacoesFiltradas.length !== 0 && (
            <>
            <div className="ml-1 flex flex-wrap gap-4">
            Legenda: 
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-l-4 border-blue-500 rounded"></div>
              <span className="text-sm">Disciplina Obrigatória</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded"></div>
              <span className="text-sm">Disciplina Optativa</span>
            </div>
          </div>

            <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50 font-medium text-sm">Horário</th>
                  {diasSemana.map((dia) => (
                    <th key={dia} className="border border-gray-300 p-2 bg-gray-50 font-medium text-sm min-w-[150px]">
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horarios.map((horario) => (
                  <tr key={horario}>
                    <td className="border border-gray-300 p-2 bg-gray-50 font-medium text-sm text-center">{horario}</td>
                    {diasSemana.map((dia) => {
                      const conflitos = verificarConflito(dia, horario)

                      return (
                        <td key={`${dia}-${horario}`} className="border border-gray-300 p-1 h-16 align-top">
                          {conflitos.map((alocacao, index) => {
                            const disciplina = obterDisciplinaPorAlocacao(alocacao.id)
                            const docente = obterDocentePorAlocacao(alocacao.id)

                            if (!disciplina || !docente) return null

                            return (
                              <div
                                key={alocacao.id}
                                className={`
                                  text-xs p-1 rounded mb-1 border-l-4
                                  ${
                                    disciplina.natureza === "OBRIGATÓRIA"
                                      ? "bg-blue-100 border-blue-500 text-blue-800"
                                      : "bg-green-100 border-green-500 text-green-800"
                                  }
                                `}
                              >
                                <div className="font-medium truncate" title={disciplina.componenteCurricular}>
                                  {disciplina.componenteCurricular.length > 20
                                    ? disciplina.componenteCurricular.substring(0, 20) + "..."
                                    : disciplina.componenteCurricular}
                                </div>
                                <div className="text-xs opacity-75 truncate" title={docente.nome}>
                                  {docente.nome.length > 15 ? docente.nome.substring(0, 15) + "..." : docente.nome}
                                </div>
                                <div className="text-xs font-mono">{disciplina.codigo}</div>
                              </div>
                            )
                          })}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
          )}
          
          {alocacoesFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma alocação encontrada para os filtros selecionados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
