"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Disciplina, Docente, Curso, Alocacao, Conflito } from "./types"

interface Store {
  disciplinas: Disciplina[]
  docentes: Docente[]
  cursos: Curso[]
  alocacoes: Alocacao[]
  conflitos: Conflito[]

  // Actions
  addDisciplina: (disciplina: Disciplina) => void
  updateDisciplina: (id: string, disciplina: Partial<Disciplina>) => void
  removeDisciplina: (id: string) => void

  addDocente: (docente: Docente) => void
  updateDocente: (id: string, docente: Partial<Docente>) => void
  removeDocente: (id: string) => void

  addCurso: (curso: Curso) => void
  updateCurso: (id: string, curso: Partial<Curso>) => void
  removeCurso: (id: string) => void

  addAlocacao: (alocacao: Alocacao) => void
  updateAlocacao: (id: string, alocacao: Partial<Alocacao>) => void
  removeAlocacao: (id: string) => void

  importarDados: (dados: any[]) => void
  detectarConflitos: () => void

  limparDados: () => void 
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      disciplinas: [],
      docentes: [],
      cursos: [],
      alocacoes: [],
      conflitos: [],

      limparDados: () => set({
        disciplinas: [],
        docentes: [],
        cursos: [],
        alocacoes: [],
        conflitos: [],
      }),

      addDisciplina: (disciplina) => set((state) => ({ disciplinas: [...state.disciplinas, disciplina] })),

      updateDisciplina: (id, updates) =>
        set((state) => ({
          disciplinas: state.disciplinas.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),

      removeDisciplina: (id) =>
        set((state) => ({
          disciplinas: state.disciplinas.filter((d) => d.id !== id),
        })),

      addDocente: (docente) => set((state) => ({ docentes: [...state.docentes, docente] })),

      updateDocente: (id, updates) =>
        set((state) => ({
          docentes: state.docentes.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),

      removeDocente: (id) =>
        set((state) => ({
          docentes: state.docentes.filter((d) => d.id !== id),
        })),

      addCurso: (curso) => set((state) => ({ cursos: [...state.cursos, curso] })),

      updateCurso: (id, updates) =>
        set((state) => ({
          cursos: state.cursos.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      removeCurso: (id) =>
        set((state) => ({
          cursos: state.cursos.filter((c) => c.id !== id),
        })),

      addAlocacao: (alocacao) => {
        set((state) => ({ alocacoes: [...state.alocacoes, alocacao] }))
        get().detectarConflitos()
      },

      updateAlocacao: (id, updates) => {
        set((state) => ({
          alocacoes: state.alocacoes.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }))
        get().detectarConflitos()
      },

      removeAlocacao: (id) => {
        set((state) => ({
          alocacoes: state.alocacoes.filter((a) => a.id !== id),
        }))
        get().detectarConflitos()
      },

      importarDados: (dados) => {
        const disciplinas: Disciplina[] = []
        const docentes: Docente[] = []
        const cursos: Curso[] = []

        const norm = (s: string) =>
          (s ?? "")
            .toString()
            .replace(/\ufeff/g, "")
            .trim()

        const noAcc = (s: string) =>
          norm(s).normalize("NFD").replace(/\p{Diacritic}/gu, "")

        dados.forEach((linhaRaw) => {
          // normaliza chaves → objeto kmap com UPPERCASE sem acento/espaço
          const kmap: Record<string, string> = {}
          for (const [k, v] of Object.entries(linhaRaw ?? {})) {
            const nk = noAcc(k).replace(/\s+/g, "").toUpperCase()
            kmap[nk] = norm(String(v ?? ""))
          }

          const curso = kmap["CURSO"] || ""
          const semestre = kmap["SEMESTRE"] || ""
          const componente = kmap["COMPONENTECURRICULAR"] || ""
          const ch = parseInt(kmap["CH"] || "0") || 0
          const codigo = kmap["CODIGO"] || ""

          // Natureza com variações ("OPTATIVA"/"OBRIGATORIA" sem acento)
          const naturezaRaw = noAcc(kmap["NATUREZA"] || "").toUpperCase()
          const natureza: "OBRIGATÓRIA" | "OPTATIVA" =
            naturezaRaw.includes("OPTAT") ? "OPTATIVA" : "OBRIGATÓRIA"

          const docentesLista = (kmap["DOCENTES"] || "")
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean)

          // Regras mínimas para considerar válido
          if (!curso || !componente) return

          const disciplina: Disciplina = {
            id: `disc_${codigo || noAcc(componente).replace(/\W+/g, "_")}_${Date.now()}`,
            curso,
            semestre,
            componenteCurricular: componente,
            ch,
            natureza,
            codigo,
            docentes: docentesLista,
          }
          disciplinas.push(disciplina)

          // Docentes (únicos por nome)
          docentesLista.forEach((nomeDocente) => {
            if (!docentes.find((d) => d.nome === nomeDocente)) {
              docentes.push({
                id: `doc_${noAcc(nomeDocente).replace(/\s+/g, "_")}_${Date.now()}`,
                nome: nomeDocente,
              })
            }
          })

          // Curso (único por nome)
          if (curso && !cursos.find((c) => c.nome === curso)) {
            // heurística simples de turno
            const cursoNoAcc = noAcc(curso).toUpperCase()
            const turno =
              cursoNoAcc.includes("NOTURNO") ? "NOTURNO" : "DIURNO"

            cursos.push({
              id: `curso_${noAcc(curso).replace(/\s+/g, "_")}_${Date.now()}`,
              nome: curso,
              turno,
            })
          }
        })

        set({ disciplinas, docentes, cursos })
      },


      detectarConflitos: () => {
        const { alocacoes, disciplinas } = get()
        const conflitos: Conflito[] = []

        // Detectar conflitos de docente
        alocacoes.forEach((alocacao1, index1) => {
          alocacoes.forEach((alocacao2, index2) => {
            if (index1 >= index2) return

            if (alocacao1.docenteId === alocacao2.docenteId) {
              const temConflito = alocacao1.diasSemana.some(
                (dia) =>
                  alocacao2.diasSemana.includes(dia) &&
                  horariosSeConflitam(
                    alocacao1.horarioInicio,
                    alocacao1.horarioFim,
                    alocacao2.horarioInicio,
                    alocacao2.horarioFim,
                  ),
              )

              if (temConflito) {
                const docente = get().docentes.find((d) => d.id === alocacao1.docenteId)
                conflitos.push({
                  id: `conflito_${Date.now()}_${index1}_${index2}`,
                  tipo: "DOCENTE",
                  descricao: `Conflito de docente: ${docente?.nome} está alocado em horários conflitantes`,
                  alocacoes: [alocacao1.id, alocacao2.id],
                  severidade: "ERRO",
                })
              }
            }
          })
        })

        set({ conflitos })
      },
    }),
    {
      name: "gestao-academica-storage",
    },
  ),
)

function horariosSeConflitam(inicio1: string, fim1: string, inicio2: string, fim2: string): boolean {
  const [h1i, m1i] = inicio1.split(":").map(Number)
  const [h1f, m1f] = fim1.split(":").map(Number)
  const [h2i, m2i] = inicio2.split(":").map(Number)
  const [h2f, m2f] = fim2.split(":").map(Number)

  const inicio1Min = h1i * 60 + m1i
  const fim1Min = h1f * 60 + m1f
  const inicio2Min = h2i * 60 + m2i
  const fim2Min = h2f * 60 + m2f

  return !(fim1Min <= inicio2Min || fim2Min <= inicio1Min)
}

export function exportarAlocacoesParaCSV(alocacoes: Alocacao[], docentes: Docente[], disciplinas: Disciplina[]): string {
  const header = [
    "Curso", "Semestre", "Componenete", "CH", "Natureza", "Código", "Docente", "Dias da Semana", "Horário Início", "Horário fim"
  ].join(",")

  const rows = alocacoes.map((a) => {
    const disciplina = disciplinas.find((d) => d.id === a.disciplinaId)
    const docente = docentes.find((d) => d.id === a.docenteId)

    return [
      disciplina?.curso || "",
      disciplina?.semestre || "",
      disciplina?.componenteCurricular || "",
      disciplina?.ch || "",
      disciplina?.natureza || "",
      disciplina?.codigo || "",
      docente?.nome || "",
      a.diasSemana.join(","),
      a.horarioInicio,
      a.horarioFim,
    ].join(",")
  })

  return [header, ...rows].join("\n")
}
