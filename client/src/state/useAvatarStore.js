import { create } from 'zustand';
import { Apple, Droplet, Dumbbell, Moon } from 'lucide-react';

export const CATEGORIAS = [
  { chave: 'sono', label: 'Sono', Icone: Moon, cor: 'var(--accent-blue)' },
  { chave: 'agua', label: 'Água', Icone: Droplet, cor: 'var(--accent-mint)' },
  { chave: 'alimentacao', label: 'Alimentação', Icone: Apple, cor: 'var(--accent-gold)' },
  { chave: 'treino', label: 'Treino', Icone: Dumbbell, cor: 'var(--accent-coral)' },
];

const ESTAGIOS = {
  sono: ['Sonolento', 'Cochilando', 'Descansado', 'Revigorado', 'Mestre do Sono'],
  agua: ['Desidratado', 'Sedento', 'Hidratado', 'Fluindo', 'Aquático'],
  alimentacao: ['Faminto', 'Beliscador', 'Equilibrado', 'Nutrido', 'Mestre Nutricional'],
  treino: ['Sedentário', 'Iniciante', 'Ativo', 'Atleta', 'Lenda do Treino'],
};

export const CATALOGO_ITENS = {
  sono: [
    { nivel: 1, nome: 'Travesseiro Surrado', icone: '🛏️' },
    { nivel: 2, nome: 'Cobertor Aconchegante', icone: '🧣' },
    { nivel: 3, nome: 'Máscara de Dormir', icone: '😴' },
    { nivel: 4, nome: 'Difusor de Aromas', icone: '🕯️' },
    { nivel: 5, nome: 'Coroa do Sono', icone: '👑' },
  ],
  agua: [
    { nivel: 1, nome: 'Garrafinha Furada', icone: '🚰' },
    { nivel: 2, nome: 'Squeeze Personalizada', icone: '🥤' },
    { nivel: 3, nome: 'Filtro Purificador', icone: '💠' },
    { nivel: 4, nome: 'Fonte Encantada', icone: '⛲' },
    { nivel: 5, nome: 'Tridente das Águas', icone: '🔱' },
  ],
  alimentacao: [
    { nivel: 1, nome: 'Maçã Selvagem', icone: '🍏' },
    { nivel: 2, nome: 'Cesta de Vegetais', icone: '🥦' },
    { nivel: 3, nome: 'Livro de Receitas', icone: '📖' },
    { nivel: 4, nome: 'Tempero Raro', icone: '🌿' },
    { nivel: 5, nome: 'Talher Lendário', icone: '🍴' },
  ],
  treino: [
    { nivel: 1, nome: 'Tênis Surrado', icone: '👟' },
    { nivel: 2, nome: 'Faixa de Resistência', icone: '🎽' },
    { nivel: 3, nome: 'Halteres de Ferro', icone: '🏋️' },
    { nivel: 4, nome: 'Armadura de Atleta', icone: '🛡️' },
    { nivel: 5, nome: 'Cinturão de Campeão', icone: '🥇' },
  ],
};

export const MASCOTE_ESTAGIOS = [
  { estagio: 1, nome: 'Ovo', descricao: 'Ainda dormente, esperando para começar.' },
  { estagio: 2, nome: 'Filhote', descricao: 'Uma pequena criatura tomando forma.' },
  { estagio: 3, nome: 'Jovem', descricao: 'Características mais definidas, ganhando cor.' },
  { estagio: 4, nome: 'Forte', descricao: 'Postura confiante, com destaques coral.' },
  { estagio: 5, nome: 'Poderoso', descricao: 'Uma aura dourada começa a brilhar.' },
  { estagio: 6, nome: 'Lendário', descricao: 'Forma completa, coral e dourado combinados.' },
];

const LIMITES_MASCOTE = [0, 80, 200, 400, 650, 950];

const calcularIndiceEstagioMascote = (pontosTotais) => {
  let indice = 0;
  for (let i = 0; i < LIMITES_MASCOTE.length; i += 1) {
    if (pontosTotais >= LIMITES_MASCOTE[i]) {
      indice = i;
    }
  }
  return indice;
};

const somarPontosTotais = (state) => CATEGORIAS.reduce((soma, { chave }) => soma + state[chave].pontosAcumulados, 0);

const paraISO = (data) => data.toISOString().slice(0, 10);

const hojeISO = () => paraISO(new Date());

const ontemISO = () => {
  const data = new Date();
  data.setDate(data.getDate() - 1);
  return paraISO(data);
};

const diasEntreISO = (dataA, dataB) => Math.round((new Date(dataB) - new Date(dataA)) / 86400000);

const LIMITES_NIVEL = [0, 10, 25, 45, 70];

const calcularNivel = (pontosAcumulados) => {
  let nivel = 1;
  for (let i = 0; i < LIMITES_NIVEL.length; i += 1) {
    if (pontosAcumulados >= LIMITES_NIVEL[i]) {
      nivel = i + 1;
    }
  }
  return nivel;
};

const criarCategoria = (categoria, nivel, pontosAcumulados) => ({
  nivel,
  nomeEstagio: ESTAGIOS[categoria][nivel - 1],
  pontosAcumulados,
});

const useAvatarStore = create((set, get) => ({
  sono: criarCategoria('sono', 3, 120),
  agua: criarCategoria('agua', 1, 20),
  alimentacao: criarCategoria('alimentacao', 4, 340),
  treino: criarCategoria('treino', 2, 80),

  streak: {
    diasConsecutivos: 7,
    melhorSequencia: 7,
    ultimoCheckIn: ontemISO(),
  },
  streakAcabouDeSubir: false,
  mascoteEvoluiu: false,

  diaAtual: 47,
  diaTotal: 100,
  pontosSemana: 85,

  avancarEstagio: (categoria) =>
    set((state) => {
      const atual = state[categoria];
      const novoNivel = Math.min(atual.nivel + 1, 5);
      return {
        [categoria]: criarCategoria(categoria, novoNivel, atual.pontosAcumulados),
      };
    }),

  registrarHabito: (categoria, valor) => {
    const estagioMascoteAntes = calcularIndiceEstagioMascote(somarPontosTotais(get()));

    set((state) => {
      const atual = state[categoria];
      const novosPontos = atual.pontosAcumulados + valor;
      const novoNivel = calcularNivel(novosPontos);
      return {
        [categoria]: criarCategoria(categoria, novoNivel, novosPontos),
      };
    });

    const estagioMascoteDepois = calcularIndiceEstagioMascote(somarPontosTotais(get()));
    if (estagioMascoteDepois > estagioMascoteAntes) {
      set({ mascoteEvoluiu: true });
    }

    get().registrarCheckInDiario();
  },

  registrarCheckInDiario: () =>
    set((state) => {
      const hoje = hojeISO();
      const { diasConsecutivos, ultimoCheckIn, melhorSequencia } = state.streak;

      if (ultimoCheckIn === hoje) {
        return {};
      }

      const diferenca = ultimoCheckIn ? diasEntreISO(ultimoCheckIn, hoje) : null;
      const novoDiasConsecutivos = diferenca === 1 ? diasConsecutivos + 1 : 1;

      return {
        streak: {
          diasConsecutivos: novoDiasConsecutivos,
          ultimoCheckIn: hoje,
          melhorSequencia: Math.max(melhorSequencia, novoDiasConsecutivos),
        },
        streakAcabouDeSubir: true,
      };
    }),

  limparNotificacaoStreak: () => set({ streakAcabouDeSubir: false }),
  limparNotificacaoMascote: () => set({ mascoteEvoluiu: false }),
}));

export const selecionarItensDesbloqueados = (state) =>
  CATEGORIAS.flatMap(({ chave, label, cor }) =>
    (CATALOGO_ITENS[chave] || [])
      .filter((item) => item.nivel <= state[chave].nivel)
      .map((item) => ({ ...item, categoria: chave, categoriaLabel: label, cor })),
  );

export const selecionarNivelGeral = (state) => {
  const pontosTotais = somarPontosTotais(state);
  const indiceEstagio = calcularIndiceEstagioMascote(pontosTotais);
  const limiteAtual = LIMITES_MASCOTE[indiceEstagio];
  const limiteProximo = LIMITES_MASCOTE[indiceEstagio + 1] ?? null;
  const percentualProximo = limiteProximo
    ? Math.min(100, Math.round(((pontosTotais - limiteAtual) / (limiteProximo - limiteAtual)) * 100))
    : 100;

  return {
    pontosTotais,
    indiceEstagio,
    estagioAtual: MASCOTE_ESTAGIOS[indiceEstagio],
    limiteProximo,
    percentualProximo,
  };
};

export default useAvatarStore;
