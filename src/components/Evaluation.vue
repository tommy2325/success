<template>
    <div class="evaluation">
        <div class="header">
            <h1>QUESTIONNAIRE</h1>
        </div>
        
        <div class="questionnaire-content">
            <h2>QUESTION n°{{ currentQuestion + 1 }}</h2>
            <div class="timer">{{ formatTime() }}</div>

            <div class="question-section">
                <div class="question">{{ questions[currentQuestion]?.titre }}</div>
                <div class="answers">
                    <button
                        v-for="(answer, index) in answers[currentQuestion]"
                        :key="index"
                        :class="{ selected: selectedAnswers[currentQuestion] === answer }"
                        @click="selectAnswer(answer)"
                    >
                        {{ answer.titre }}
                    </button>
                </div>
            </div>

            <div class="navigation">
                <button class="btn back" @click="goBack">Retour</button>
                <button class="btn next" @click="submitQuestion">Suivante</button>
            </div>
        </div>

        <div class="footer">
            <span>Question : {{ currentQuestion + 1 }}/{{ questions.length }}</span>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../supabase";

export default {
    props: {
        userId: { type: String, required: true },
        inputCode: { type: String, required: true },
    },
    setup(props) {
        const currentQuestion = ref(0);
        const timer = ref(0);
        const timerInterval = ref(null);
        const questions = ref([]);
        const answers = ref([]);
        const selectedAnswers = ref([]);
        const questionnaire = ref(null);

        onMounted(async () => {
            try {
                // Récupérer le questionnaire
                const { data: questionnaireData } = await supabase
                    .from("questionnaire")
                    .select("*")
                    .eq("code", props.inputCode)
                    .single();

                if (!questionnaireData) return;
                questionnaire.value = questionnaireData;

                const { data: questionsData } = await supabase
                    .from("question")
                    .select("*")
                    .eq("id_questionnaire", questionnaireData.id_questionnaire);

                questions.value = questionsData;

                // Récupérer les réponses pour chaque question
                for (const question of questionsData) {
                    const { data: answersData } = await supabase
                        .from("reponse")
                        .select("*")
                        .eq("id_question", question.id_question);

                    answers.value.push(answersData);
                    selectedAnswers.value.push(null);
                }

                startTimer();
            } catch (error) {
                console.error("Erreur lors de l'initialisation :", error);
            }
        });

        onUnmounted(() => {
            clearInterval(timerInterval.value);
        });

        const startTimer = () => {
            timerInterval.value = setInterval(() => timer.value++, 1000);
        };

        const formatTime = () => {
            const minutes = Math.floor(timer.value / 60);
            const seconds = timer.value % 60;
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        };

        const selectAnswer = (answer) => {
            selectedAnswers.value[currentQuestion.value] = answer;
        };

        const submitQuestion = () => {
            if (currentQuestion.value < questions.value.length - 1) {
                currentQuestion.value++;
            } else {
                // Calculer et sauvegarder les résultats ici
            }
        };

        const goBack = () => {
            // Navigation vers une autre page
        };

        return {
            currentQuestion,
            questions,
            answers,
            selectedAnswers,
            questionnaire,
            timer,
            formatTime,
            selectAnswer,
            submitQuestion,
            goBack,
        };
    },
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
    background-color: #b18cd8;
    color: white;
    text-align: center;
    padding: 10px;
    font-size: 20px;
    position: relative;
}

.user-info {
    position: absolute;
    top: 10px;
    right: 10px;
}

.timer {
    font-size: 1.5rem;
    margin: 10px 0;
    text-align: center;
    color: #555;
}

.questionnaire-content {
    background-color: #f7f7f7;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.question-section {
    margin: 20px 0;
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

.navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.navigation .btn {
    background-color: #b18cd8;
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
