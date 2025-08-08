"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { useStore } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


function normalizeHeader(h: string) {
  return h
    ?.replace(/\ufeff/g, "")               // remove BOM
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")        // remove acentos
    .replace(/\s+/g, "")                   // remove espaços internos
    .toUpperCase()
}

function mapRowToContract(row: Record<string, any>) {
  // row já chega com headers normalizados (normalizeHeader)
  const get = (k: string) => (row[k] ?? "").toString().trim()

  // mapeia aliases comuns
  const CURSO = get("CURSO") || get("curso")
  const SEMESTRE = get("SEMESTRE") || get("semestre")
  const COMPONENTECURRICULAR =
    get("COMPONENTECURRICULAR") || get("COMPONENTE_CURRICULAR") || get("DISCIPLINA")
  const CH = get("CH") || get("CARGAHORARIA") || "0"
  const Natureza = get("NATUREZA") || get("Natureza") || "OBRIGATÓRIA"
  const CODIGO = get("CODIGO") || get("COD")
  const DOCENTES = get("DOCENTES") || get("PROFESSOR")

  return { CURSO, SEMESTRE, COMPONENTECURRICULAR, CH, Natureza, CODIGO, DOCENTES }
}

function normalizeObjectKeys<T extends Record<string, any>>(obj: T) {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj || {})) {
    out[normalizeHeader(k)] = v
  }
  return out
}

async function parseCsvFile(file: File) {
  const text = await file.text()
  return new Promise<any[]>((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      delimiter: "", // auto-detecta ; , \t
      transformHeader: normalizeHeader,
      complete: (res) => {
        const dados = (res.data as any[])
          .map(mapRowToContract)
          .filter((r) => r.CURSO && r.COMPONENTECURRICULAR)
        resolve(dados)
      },
      error: (err) => reject(err),
    })
  })
}

async function parseXlsxFile(file: File) {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: "array" })

  // 1ª planilha
  const firstSheetName = wb.SheetNames[0]
  const ws = wb.Sheets[firstSheetName]

  // Converte para objetos; defval garante string vazia em células vazias
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, {
    header: 1,     // primeiro vamos pegar como matriz para limpar o header
    defval: "",
    blankrows: false,
  }) as any[]

  if (!rawRows.length) return []

  // primeira linha = header
  const headerRow = (rawRows[0] as string[]).map((h) => normalizeHeader(String(h ?? "")))
  const dataRows = rawRows.slice(1)

  // monta objetos com header normalizado
  const normalizedObjects = dataRows.map((arr: any[]) => {
    const o: Record<string, any> = {}
    headerRow.forEach((h, idx) => {
      o[h] = (arr[idx] ?? "").toString()
    })
    return o
  })

  const dados = normalizedObjects
    .map(mapRowToContract)
    .filter((r) => r.CURSO && r.COMPONENTECURRICULAR)

  return dados
}

function isCsv(file: File) {
  const name = file.name.toLowerCase()
  return name.endsWith(".csv") || file.type.includes("csv")
}

function isXlsx(file: File) {
  const name = file.name.toLowerCase()
  return name.endsWith(".xlsx") || name.endsWith(".xls") || file.type.includes("spreadsheetml")
}

export function ImportacaoDados() {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const importarDados = useStore((state) => state.importarDados)
  const limparDados = useStore((state) => state.limparDados)


  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null
    setArquivo(file)
    setErro(null)
    setResultado(null)
  }

  const processarArquivo = async () => {
    if (!arquivo) {
      setErro("Selecione um arquivo .csv ou .xlsx")
      return
    }

    try {
      setCarregando(true)
      let dados: any[] = []

      if (isCsv(arquivo)) {
        dados = await parseCsvFile(arquivo)
      } else if (isXlsx(arquivo)) {
        dados = await parseXlsxFile(arquivo)
      } else {
        setErro("Formato não suportado. Envie .csv, .xlsx ou .xls.")
        return
      }

      importarDados(dados)
      setResultado({
        sucesso: true,
        totalLinhas: dados.length,
        amostra: dados.slice(0, 5),
      })
      setErro(null)
    } catch (e: any) {
      console.error(e)
      setErro("Falha ao processar o arquivo. Verifique o conteúdo e o cabeçalho.")
    } finally {
      setCarregando(false)
    }
  }

  return (<>
    <Card>
      <CardHeader>
        <CardTitle>Importação de Dados</CardTitle>
        <CardDescription>Envie seu CSV/XLSX para ser importado pelo sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="arquivo">Arquivo</Label>
          <Input
            id="arquivo"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={carregando}
          />
        </div>

        {arquivo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileSpreadsheet className="w-4 h-4" />
            {arquivo.name} ({(arquivo.size / 1024).toFixed(1)} KB)
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={processarArquivo} disabled={!arquivo || carregando}>
            <Upload className="w-4 h-4 mr-2" />
            Processar
          </Button>
          <Button
            onClick={() => {setConfirmOpen(true)}}
            variant="outline"
            disabled={carregando}
          >
            Limpar dados
          </Button>
        </div>

        {carregando && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Processando arquivo…</AlertDescription>
          </Alert>
        )}

        {erro && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {resultado?.sucesso && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Importação concluída. Linhas válidas: <b>{resultado.totalLinhas}</b>.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>

  {/* Modal para confirmar exclusão de dados */}
  <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmar limpeza dos dados</AlertDialogTitle>
        <AlertDialogDescription>
          Essa ação apagará todas as disciplinas, docentes e cursos carregados no sistema. 
          Essa operação não pode ser desfeita. Deseja continuar?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            limparDados()
            setArquivo(null)
            setResultado(null)
            setErro(null)
            setConfirmOpen(false)
          }}
        >
          Sim, apagar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</>
  )
}
