/*
 * Trivia content transcribed from the supplied Sarah's Bachelorette Trivia deck.
 * Keep content changes in this file so the application logic remains reusable.
 */
window.gameData = {
  title: "Sarah’s Bachelorette Trivia",
  weddingDate: "2026-10-10T17:00:00-06:00",
  weddingTimeZone: "America/Denver",
  categories: [
    {
      id: "wedding-scenes",
      name: "Name That Wedding Scene",
      clues: [
        {
          id: "wedding-scenes-100",
          value: 100,
          question: "Name the Movie",
          answer: "Crazy Rich Asians",
          questionImage: "assets/images/movie-100-question.png",
          answerImage: "assets/images/movie-100-answer.png"
        },
        {
          id: "wedding-scenes-200",
          value: 200,
          question: "Name the Movie",
          answer: "The Princess Bride",
          questionImage: "assets/images/movie-200-question.png",
          answerImage: "assets/images/movie-200-answer.png"
        },
        {
          id: "wedding-scenes-300",
          value: 300,
          question: "Name the Movie",
          answer: "Twilight: Breaking Dawn",
          questionImage: "assets/images/movie-300-question.png",
          answerImage: "assets/images/movie-300-answer.png"
        },
        {
          id: "wedding-scenes-400",
          value: 400,
          question: "Name the Movie",
          answer: "My Big Fat Greek Wedding",
          questionImage: "assets/images/movie-400-question.png",
          answerImage: "assets/images/movie-400-answer.png"
        },
        {
          id: "wedding-scenes-500",
          value: 500,
          question: "Name the Movie",
          answer: "27 Dresses",
          questionImage: "assets/images/movie-500-question.png",
          answerImage: "assets/images/movie-500-answer.png"
        },
        {
          id: "wedding-scenes-600",
          value: 600,
          question: "Name the Movie",
          answer: "Princess Diaries 2: Royal Engagement",
          questionImage: "assets/images/movie-600-question.png",
          answerImage: "assets/images/movie-600-answer.png"
        }
      ]
    },
    {
      id: "superlatives",
      name: "Bride/Bridesmaid Superlatives",
      clues: [
        {
          id: "superlatives-100",
          value: 100,
          question: "Who would be the most likely to make it to the last round of Survivor?",
          answerType: "superlative"
        },
        {
          id: "superlatives-200",
          value: 200,
          question: "Who is most likely to be late for something because they were petting a dog?",
          answerType: "superlative"
        },
        {
          id: "superlatives-300",
          value: 300,
          question: "Who would have their suitcase packed the furthest in advance for a trip?",
          answerType: "superlative"
        },
        {
          id: "superlatives-400",
          value: 400,
          question: "Who is most likely to be featured in a viral video?",
          answerType: "superlative"
        },
        {
          id: "superlatives-500",
          value: 500,
          question: "Who is most likely to recieve an award for best driving?",
          answerType: "superlative"
        },
        {
          id: "superlatives-600",
          value: 600,
          question: "Who is most likely to be a stunning bride in October 2026?",
          answerType: "superlative"
        }
      ]
    },
    {
      id: "wedding-history",
      name: "Wedding History",
      clues: [
        {
          id: "wedding-history-100",
          value: 100,
          question: "What culture started the tradition of exchanging rings?",
          answer: "Egyptian"
        },
        {
          id: "wedding-history-200",
          value: 200,
          question: "What were Groomsmen formerly called?",
          answer: "Bride’s Knights"
        },
        {
          id: "wedding-history-300",
          value: 300,
          question: "How much did Queen Victoria and Prince Albert's Wedding Cake weigh? (1840)\n100, 200, or 300 lbs",
          answer: "300 lbs!!",
          answerImage: "assets/images/history-300-answer.png"
        },
        {
          id: "wedding-history-400",
          value: 400,
          question: "When did the tradition of mailing printed wedding invitations emerge?\n1500's, 1600's, or 1700's",
          answer: "1600's!",
          answerNote: "Following the invention of metal-plate engraving in 1642, printed invitations became a more refined way to share wedding details, evolving from town criers and newspaper announcements."
        },
        {
          id: "wedding-history-500",
          value: 500,
          question: "Why do wedding cakes have tiers?",
          answer: "The tradition began in medieval England, where couples tried to kiss over stacked buns or cakes."
        },
        {
          id: "wedding-history-600",
          value: 600,
          question: "Why is the fourth finger on the left hand known as the 'ring finger'?",
          answer: "The Romans believed it contained the \"vein of love\" that is directly connected to the heart."
        }
      ]
    },
    {
      id: "wedding-facts",
      name: "Wedding Fun Facts",
      clues: [
        {
          id: "wedding-facts-100",
          value: 100,
          question: "What is the most popular wedding cake flavor?",
          answer: "Vanilla!"
        },
        {
          id: "wedding-facts-200",
          value: 200,
          question: "Which social media platform is most used by brides when planning a wedding?",
          answer: "Pinterest!"
        },
        {
          id: "wedding-facts-300",
          value: 300,
          question: "Which month is the most popular wedding month?\n(per a report from 2022)",
          answer: "October!"
        },
        {
          id: "wedding-facts-400",
          value: 400,
          question: "Which U.S. City hosts the most weddings annually?",
          answer: "Las Vegas, Nevada"
        },
        {
          id: "wedding-facts-500",
          value: 500,
          question: "How many weddings were recorded in Utah in 2025?\nMore than 10,000, more than 25,000 or more than 40,000?",
          answer: "Over 40,000!"
        },
        {
          id: "wedding-facts-600",
          value: 600,
          question: "How many days are left until Sarah and Ford’s wedding?",
          answerType: "countdown"
        }
      ]
    },
    {
      id: "groom-said",
      name: "What Did the Groom Say?",
      clues: [
        {
          id: "groom-said-100",
          value: 100,
          question: "What is Ford’s favorite thing about Sarah?",
          answer: "My favorite thing about Sarah is how kind and caring she is for me and others.",
          answerNote: "everybody say awwwwe"
        },
        {
          id: "groom-said-200",
          value: 200,
          question: "What did Ford say Sarah’s favorite movie is?",
          answer: "The Emperor’s New Groove"
        },
        {
          id: "groom-said-300",
          value: 300,
          question: "What did Ford say Sarah’s go-to coffee order is?",
          answer: "A flat white"
        },
        {
          id: "groom-said-400",
          value: 400,
          question: "What did Ford say was his and Sarah’s favorite thing to do together?",
          answer: "Getting outside, Mainly hiking"
        },
        {
          id: "groom-said-500",
          value: 500,
          question: "What did Ford say was his and Sarah’s favorite place they have visited together?",
          answer: "Thailand!"
        },
        {
          id: "groom-said-600",
          value: 600,
          question: "What would Ford say is one word that best describes Sarah?",
          answer: "Compassionate"
        }
      ]
    }
  ]
};