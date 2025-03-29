<template>
  <div class="evaluation">
    <div class="header">
      <h1>Correction du Questionnaire</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <button class="logout-button" @click="logout">Déconnexion</button>
      </div>
    </div>

    <div class="timer">{{ formatTime() }}</div>

    <div class="questionnaire-content">
      <div class="question-section">
        <div class="question-number">Question N°{{ currentQuestion + 1 }} / {{ questions.length }}</div>
        <div class="question">{{ questions[currentQuestion]?.titre }}</div>
        <div class="answers">
          <button
            v-for="(answer, index) in answers[currentQuestion]"
            :key="index"
            :class="{
              correct: answer.etre_bonne_reponse && selectedAnswers[currentQuestion] === answer.id_reponse,
              incorrect: !answer.etre_bonne_reponse && selectedAnswers[currentQuestion] === answer.id_reponse,
              selected: selectedAnswers[currentQuestion] === answer.id_reponse
            }"
          >
            {{ answer.titre }}
          </button>
        </div>
      </div>

      <div class="navigation">
        <button class="btn next" @click="submitQuestion">
          {{ currentQuestion < questions.length - 1 ? 'Suivante' : 'Finir la correction' }}
        </button>
      </div>
    </div>

    <div class="footer">
      <span>Question : {{ currentQuestion + 1 }}/{{ questions.length }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import { supabase } from "../supabase";

export default {
  props: {
    userId: { type: String, required: true },
    questionnaire: { type: Object, required: true },
    username: { type: String, required: true }
  },
  setup(props) {
    const router = useRouter();
    const currentQuestion = ref(0);
    const timer = ref(0);
    const timerInterval = ref(null);
    const questions = ref([]);
    const answers = ref([]);
    const selectedAnswers = ref([]);

    // Fonction pour récupérer les données de correction (questions, réponses et réponses sélectionnées)
    const fetchCorrectionData = async () => {
      try {
        // Récupérer les questions du questionnaire
        const { data: questionIdsData, error: questionIdsError } = await supabase
          .from('contenir')
          .select('id_question')
          .eq('id_questionnaire', props.questionnaire.id_questionnaire);

        if (questionIdsError) {
          throw new Error(questionIdsError.message);
        }

        const questionIds = questionIdsData.map(q => q.id_question);

        // Récupérer les questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('question')
          .select('*')
          .in('id_question', questionIds);

        if (questionsError) {
          throw new Error(questionsError.message);
        }

        questions.value = questionsData;

        // Récupérer les réponses pour chaque question
        for (const question of questionsData) {
          const { data: answersData, error: answersError } = await supabase
            .from('reponse')
            .select('*')
            .eq('id_question', question.id_question);

          if (answersError) {
            throw new Error(answersError.message);
          }

          answers.value.push(answersData);
        }

        // Récupérer les réponses de l'utilisateur
        const { data: selectedAnswersData, error: selectedAnswersError } = await supabase
          .from('reponse_utilisateur')
          .select('id_question, id_reponse')
          .eq('id_utilisateur', props.userId)
          .eq('id_questionnaire', props.questionnaire.id_questionnaire);

        if (selectedAnswersError) {
          throw new Error(selectedAnswersError.message);
        }

        selectedAnswers.value = selectedAnswersData.reduce((acc, answer) => {
          acc[answer.id_question] = answer.id_reponse;
          return acc;
        }, {});

      } catch (error) {
        console.error("Erreur lors de la récupération des données de correction :", error);
      }
    };

    // Déconnexion de l'utilisateur
    const logout = async () => {
      await supabase.auth.signOut();
      router.push({ name: 'Login' });
    };

    // Fonction pour passer à la question suivante ou finir la correction
    const submitQuestion = async () => {
      if (currentQuestion.value < questions.value.length - 1) {
        currentQuestion.value++;
      } else {
        alert("Correction terminée");
        router.push({ name: 'Home' }); // Ou retourner à une autre page
      }
    };

    // Formater le temps
    const formatTime = () => {
      const minutes = Math.floor(timer.value / 60);
      const seconds = timer.value % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Initialisation des données lors du montage
    onMounted(() => {
      fetchCorrectionData();
      startTimer();
    });

    // Logique du timer
    const startTimer = () => {
      timerInterval.value = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          clearInterval(timerInterval.value);
          // Logique à faire lorsque le temps est écoulé (fin du questionnaire)
        }
      }, 1000);
    };

    // Nettoyage du timer lorsque le composant est démonté
    onUnmounted(() => {
      clearInterval(timerInterval.value);
    });

    return {
      currentQuestion,
      questions,
      answers,
      selectedAnswers,
      timer,
      formatTime,
      submitQuestion,
      logout
    };
  }
};
</script>

<style scoped>
.evaluation {
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

.header {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  width: 98%;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: white;
  font-size: 2rem;
  flex-grow: 1;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-right: 20px;
  color: white;
  font-size: 1rem;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c0392b;
}

.timer {
  font-size: 1.5rem;
  margin: 10px 0;
  text-align: center;
  color: #555;
}

.questionnaire-content {
  margin-top: 80px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.question-section {
  margin: 20px 0;
}

.question-number {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answers button {
  background-color: #d9c2f0;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.answers button.selected {
  background-color: #a983db;
  color: white;
}

.answers button.correct {
  background-color: #d4edda;
  color: #155724;
}

.answers button.incorrect {
  background-color: #f8d7da;
  color: #721c24;
}

.navigation {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.navigation .btn {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.navigation .btn:hover {
  background-color: #a070c2;
}

.footer {
  text-align: center;
  margin-top: 20px;
}
</style>
