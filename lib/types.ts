export interface Disciplina {
  id: string
  curso: string
  semestre: string
  componenteCurricular: string
  ch: number
  natureza: "OBRIGATÓRIA" | "OPTATIVA"
  codigo: string
  docentes: string[]
}

export interface Docente {
  id: string
  nome: string
  email?: string
  especialidade?: string
}

export interface Curso {
  id: string
  nome: string
  turno: "DIURNO" | "VESPERTINO" | "NOTURNO" | "VESPERTINO-NOTURNO"
}

export interface Alocacao {
  id: string
  disciplinaId: string
  docenteId: string
  diasSemana: string[]
  horarioInicio: string
  horarioFim: string
  cargaHorariaDiaria: number
}

export interface Conflito {
  id: string
  tipo: "DOCENTE" | "TURMA_OBRIGATORIA" | "TURMA_OPTATIVA"
  descricao: string
  alocacoes: string[]
  severidade: "ERRO" | "AVISO"
}
