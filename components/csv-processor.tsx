"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useStore } from "@/lib/store"

export function CSVProcessor() {
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erro ao processar CSV:</strong> {erro}
          </AlertDescription>
        </Alert>
      )}

      {resultado && resultado.sucesso && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Importação Concluída com Sucesso!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Estatísticas de Importação</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de linhas:</span>
                    <span className="font-medium">{resultado.estatisticas.totalLinhas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registros processados:</span>
                    <span className="font-medium text-green-600">{resultado.estatisticas.processadas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Erros/Linhas inválidas:</span>
                    <span className="font-medium text-red-600">{resultado.estatisticas.erros}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cursos encontrados:</span>
                    <span className="font-medium">{resultado.estatisticas.cursos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Docentes encontrados:</span>
                    <span className="font-medium">{resultado.estatisticas.docentes.length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Cursos Importados</h4>
                <div className="max-h-32 overflow-y-auto">
                  <ul className="text-sm space-y-1">
                    {resultado.estatisticas.cursos.map((curso, index) => (
                      <li key={index} className="text-gray-700">
                        • {curso}
                      </li>
                    ))}
                  </ul>
                </div>

                <h4 className="font-semibold">Semestres</h4>
                <div className="flex flex-wrap gap-1">
                  {resultado.estatisticas.semestres.map((sem, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {sem}º
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
