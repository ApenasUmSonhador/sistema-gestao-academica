"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportacaoDados } from "@/components/importacao-dados"
import { GerenciamentoEntidades } from "@/components/gerenciamento-entidades"
import { AlocacaoDisciplinas } from "@/components/alocacao-disciplinas"
import { GradeHoraria } from "@/components/grade-horaria"
import { DeteccaoConflitos } from "@/components/deteccao-conflitos"
import { Calendar, Users, BookOpen, AlertTriangle, Upload } from "lucide-react"
import { CSVProcessor } from "@/components/csv-processor"

export default function SistemaGestaoAcademica() {
  const [activeTab, setActiveTab] = useState("importacao")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Gestão Acadêmica</h1>
          <p className="text-lg text-gray-600">Coordenação de Curso - Educação Física</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="importacao" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importar/Limpar Dados
            </TabsTrigger>
            <TabsTrigger value="entidades" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gerenciamento
            </TabsTrigger>
            <TabsTrigger value="alocacao" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Alocação
            </TabsTrigger>
            <TabsTrigger value="grade" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Grade Horária
            </TabsTrigger>
            <TabsTrigger value="conflitos" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Conflitos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="importacao">
            <CSVProcessor />
            <ImportacaoDados />
          </TabsContent>

          <TabsContent value="entidades">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Entidades</CardTitle>
                <CardDescription>Visualize e gerencie disciplinas, docentes e cursos</CardDescription>
              </CardHeader>
              <CardContent>
                <GerenciamentoEntidades />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alocacao">
            <Card>
              <CardHeader>
                <CardTitle>Alocação de Disciplinas</CardTitle>
                <CardDescription>Interface principal para alocar horários e docentes às disciplinas</CardDescription>
              </CardHeader>
              <CardContent>
                <AlocacaoDisciplinas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grade">
            <Card>
              <CardHeader>
                <CardTitle>Visualização de Grade Horária</CardTitle>
                <CardDescription>Visualize a grade horária por curso, semestre ou docente</CardDescription>
              </CardHeader>
              <CardContent>
                <GradeHoraria />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflitos">
            <Card>
              <CardHeader>
                <CardTitle>Detecção de Conflitos</CardTitle>
                <CardDescription>Visualize e resolva conflitos de horários</CardDescription>
              </CardHeader>
              <CardContent>
                <DeteccaoConflitos />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
