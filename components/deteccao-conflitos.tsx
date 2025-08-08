"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react"
import { useStore } from "@/lib/store"

export function DeteccaoConflitos() {
  const { conflitos, alocacoes, disciplinas, docentes, detectarConflitos } = useStore()

  const obterDetalhesAlocacao = (alocacaoId: string) => {
    const alocacao = alocacoes.find((a) => a.id === alocacaoId)
    if (!alocacao) return null

    const disciplina = disciplinas.find((d) => d.id === alocacao.disciplinaId)
    const docente = docentes.find((d) => d.id === alocacao.docenteId)

    return { alocacao, disciplina, docente }
  }

  const conflitosErro = conflitos.filter((c) => c.severidade === "ERRO")
  const conflitosAviso = conflitos.filter((c) => c.severidade === "AVISO")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{conflitosErro.length}</div>
                <div className="text-sm text-gray-600">Conflitos Críticos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{conflitosAviso.length}</div>
                <div className="text-sm text-gray-600">Avisos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{alocacoes.length}</div>
                <div className="text-sm text-gray-600">Total de Alocações</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Relatório de Conflitos</h2>
        <Button onClick={detectarConflitos} variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Revalidar Conflitos
        </Button>
      </div>

      {conflitos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">Nenhum Conflito Detectado!</h3>
            <p className="text-gray-600">Todas as alocações estão livres de conflitos de horário.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conflitosErro.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-5 h-5" />
                  Conflitos Críticos ({conflitosErro.length})
                </CardTitle>
                <CardDescription>Estes conflitos impedem o funcionamento adequado da grade horária</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conflitosErro.map((conflito) => (
                  <Alert key={conflito.id} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="font-medium">{conflito.descricao}</div>
                        <div className="space-y-1">
                          {conflito.alocacoes.map((alocacaoId) => {
                            const detalhes = obterDetalhesAlocacao(alocacaoId)
                            if (!detalhes) return null

                            return (
                              <div key={alocacaoId} className="text-sm bg-red-50 p-2 rounded border">
                                <div className="font-medium">
                                  {detalhes.disciplina?.componenteCurricular} ({detalhes.disciplina?.codigo})
                                </div>
                                <div className="text-gray-600">Docente: {detalhes.docente?.nome}</div>
                                <div className="text-gray-600">
                                  Horário: {detalhes.alocacao.horarioInicio} - {detalhes.alocacao.horarioFim}
                                </div>
                                <div className="text-gray-600">Dias: {detalhes.alocacao.diasSemana.join(", ")}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {conflitosAviso.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  Avisos ({conflitosAviso.length})
                </CardTitle>
                <CardDescription>Situações que merecem atenção mas não impedem o funcionamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conflitosAviso.map((conflito) => (
                  <Alert key={conflito.id} className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <div className="space-y-2">
                        <div className="font-medium">{conflito.descricao}</div>
                        <div className="space-y-1">
                          {conflito.alocacoes.map((alocacaoId) => {
                            const detalhes = obterDetalhesAlocacao(alocacaoId)
                            if (!detalhes) return null

                            return (
                              <div
                                key={alocacaoId}
                                className="text-sm bg-orange-100 p-2 rounded border border-orange-200"
                              >
                                <div className="font-medium">
                                  {detalhes.disciplina?.componenteCurricular} ({detalhes.disciplina?.codigo})
                                </div>
                                <div className="text-gray-600">Docente: {detalhes.docente?.nome}</div>
                                <div className="text-gray-600">
                                  Horário: {detalhes.alocacao.horarioInicio} - {detalhes.alocacao.horarioFim}
                                </div>
                                <div className="text-gray-600">Dias: {detalhes.alocacao.diasSemana.join(", ")}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Conflitos Detectados</CardTitle>
          <CardDescription>Entenda os diferentes tipos de conflitos que o sistema pode identificar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive">ERRO</Badge>
              <div>
                <div className="font-medium">Conflito de Docente</div>
                <div className="text-sm text-gray-600">
                  O mesmo professor está alocado em duas disciplinas diferentes no mesmo horário
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="destructive">ERRO</Badge>
              <div>
                <div className="font-medium">Conflito de Turma (Obrigatórias)</div>
                <div className="text-sm text-gray-600">
                  Duas disciplinas obrigatórias do mesmo curso e semestre no mesmo horário
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-orange-500">AVISO</Badge>
              <div>
                <div className="font-medium">Conflito de Turma (Optativas)</div>
                <div className="text-sm text-gray-600">
                  Disciplina optativa no mesmo horário de uma obrigatória da mesma turma
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
