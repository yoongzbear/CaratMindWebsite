// steps for onboarding
'use client';
import {
  BicepsFlexed,
  CalendarDays,
  ChartColumn,
  ChartLine,
  ChartScatter,
  Check,
  CircleX,
  ClipboardCheck,
  Download,
  Eraser,
  Flame,
  Funnel,
  Gem,
  House,
  Mail,
  NotebookText,
  Palette,
  PenLine,
  Save,
  Search,
  Smile,
  Trash,
  User,
} from 'lucide-react';
import { Tour } from 'nextstepjs';

export function buildSteps(isDesktop: boolean): Tour[] {
  return [
    {
      tour: 'home',
      steps: [
        {
          icon: <House />,
          title: 'Home',
          content: <>Welcome to the home page.</>,
          showControls: true,
        },
        {
          icon: <ClipboardCheck />,
          title: 'Daily Habits',
          content: (
            <>
              Get reminded on basic habits to improve your well-being! Click the
              button that fits best.
            </>
          ),
          showControls: true,
          selector: '#banner',
          side: 'top',
        },
        {
          icon: <Flame />,
          title: 'Journal Streak',
          content: (
            <>
              View your current journal streak here. Maintain them for badges!
            </>
          ),
          showControls: true,
          selector: '#journal-streak',
          side: 'right',
          pointerPadding: 3,
        },
        {
          icon: <Smile />,
          title: 'Mood Chart',
          content: <>View your summarized moods in a mood chart here.</>,
          showControls: true,
          selector: '#mood-chart',
          side: 'right',
          pointerPadding: 3,
        },
        {
          icon: <Flame />,
          title: 'Coping Exercise Streak',
          content: (
            <>
              View your current coping exercise streak here. Maintain them for
              badges!
            </>
          ),
          showControls: true,
          selector: '#exercise-streak',
          side: 'left',
          pointerPadding: 3,
        },
        {
          icon: <Check />,
          title: 'Home',
          content: <>That is all for the Home page!</>,
          showControls: true,
          side: 'bottom',
        },
      ],
    },
    {
      tour: 'new_entry',
      steps: [
        {
          icon: <NotebookText />,
          title: 'New Journal Entry',
          content: <>Here is where you will create journal entries!</>,
          showControls: true,
          pointerPadding: 3,
          selector: '#new-journal',
        },
        {
          icon: <PenLine />,
          title: 'Write Entry',
          content: (
            <>
              Write your entry here! Feel free to write as long as you want to.
            </>
          ),
          showControls: true,
          selector: '#entry-text',
          side: 'top',
        },
        {
          icon: <Eraser />,
          title: 'Reset Entry',
          content: <>Click to reset your entry and start fresh.</>,
          showControls: true,
          selector: '#button-reset',
          side: isDesktop ? 'top' : 'top-left',
        },
        {
          icon: <Save />,
          title: 'Submit Entry',
          content: (
            <>
              Click to submit your entry. Your entry will be analyzed by AI to
              detect your mood. Coping exercise will also be recommended based
              on the detected mood.
            </>
          ),
          showControls: true,
          selector: '#button-submit',
          side: 'top',
        },
        {
          icon: <Save />,
          title: 'Save Entry as Draft',
          content: (
            <>
              Click to save your entry as a draft. Your entry will <b>not</b> be
              analyzed to detect mood and recommend a coping exercise. You may
              revisit the draft entry through <b>Past Entry</b> page.
            </>
          ),
          showControls: true,
          selector: '#button-draft',
          side: isDesktop ? 'top' : 'top-right',
        },

        {
          icon: <Check />,
          title: 'New Journal',
          content: (
            <>
              That is all for the New Journal page! <br />
              Once you submit an entry, your mood will be detected and a coping
              exercise will be recommended.
            </>
          ),
          showControls: true,
        },
      ],
    },
    {
      tour: 'journal_insights',
      steps: [
        {
          icon: <Gem />,
          title: 'Journal Insights',
          content: (
            <>Here are the journal insights analyzed from your journal entry!</>
          ),
          showControls: true,
        },
        {
          icon: <NotebookText />,
          title: 'Journal Entry',
          content: <>This is the summary of your journal entry.</>,
          showControls: true,
          selector: '#journal-summary',
          side: 'bottom',
          pointerPadding: 1,
        },
        {
          icon: <NotebookText />,
          title: 'Journal Entry',
          content: <>Click to view the entire journal entry here.</>,
          showControls: true,
          selector: '#button-view-entry',
          side: isDesktop ? 'top' : 'top-left',
        },
        {
          icon: <PenLine />,
          title: 'Edit Journal Entry',
          content: <>Click to edit the journal entry here.</>,
          showControls: true,
          selector: '#button-edit-entry',
          side: isDesktop ? 'top' : 'top-right',
        },
        {
          icon: <Save />,
          title: 'Submit Journal Entry',
          content: (
            <>
              Save the journal entry here if the journal status is <b>Draft</b>.
            </>
          ),
          showControls: true,
          selector: '#button-submit-entry',
          side: isDesktop ? 'top' : 'top-left',
        },
        {
          icon: <Smile />,
          title: 'Detected Mood',
          content: (
            <>This is the detected mood analyzed from your journal entry.</>
          ),
          showControls: true,
          selector: '#mood',
          side: isDesktop ? 'right' : 'top',
          pointerPadding: 1,
        },
        {
          icon: <Smile />,
          title: 'Mood Explanation',
          content: (
            <>
              Click to view the explanation of the detected mood here. You can
              agree or disagree with the detected mood.
            </>
          ),
          showControls: true,
          selector: '#button-view-mood',
          side: 'top',
        },
        {
          icon: <BicepsFlexed />,
          title: 'Recommended Coping Exercise',
          content: (
            <>
              This is the recommended coping exercise based on the detected
              mood. The completion status is displayed.
            </>
          ),
          showControls: true,
          selector: '#exercise',
          side: isDesktop ? 'left' : 'top',
          pointerPadding: 1,
        },
        {
          icon: <BicepsFlexed />,
          title: 'Coping Exercise Details',
          content: (
            <>Click to view the recommended coping exercise details here.</>
          ),
          showControls: true,
          selector: '#button-view-exercise',
          side: isDesktop ? 'top' : 'top-left',
        },
        {
          icon: <BicepsFlexed />,
          title: 'Perform Coping Exercise',
          content: (
            <>
              Click to perform the coping exercise here. This button is
              displayed when the coping exercise is recommended on the current
              day.
            </>
          ),
          showControls: true,
          selector: '#button-track-exercise',
          side: isDesktop ? 'top' : 'top-right',
        },
        {
          icon: <ChartLine />,
          title: 'Mood Chart',
          content: <>View the mood bar chart for the past week here.</>,
          showControls: true,
          selector: '#mood-chart-div',
          pointerPadding: 1,
        },
        {
          icon: <ChartLine />,
          title: 'Mood Dashboard',
          content: (
            <>Click here to view more mood charts on your Mood Dashboard.</>
          ),
          showControls: true,
          selector: '#button-mood-chart',
          side: 'top',
          pointerPadding: 4,
        },
        {
          icon: <Check />,
          title: 'Journal Insights',
          content: (
            <>
              That is all for the Journal Insights page!
              <br />
              You may access this page after <b>submitting</b> a journal entry.
            </>
          ),
          showControls: true,
        },
      ],
    },
    {
      tour: 'edit_entry',
      steps: [
        {
          icon: <NotebookText />,
          title: 'Edit Journal Entry',
          content: <>Here is where you can edit the journal entry!</>,
          showControls: true,
          pointerPadding: 3,
          selector: '#edit-journal',
        },
        {
          icon: <PenLine />,
          title: 'Write Entry',
          content: (
            <>
              Write your new entry here! Feel free to write as long as you want
              to.
            </>
          ),
          showControls: true,
          selector: '#entry-text',
          side: 'top',
        },
        {
          icon: <CircleX />,
          title: 'Cancel Update',
          content: (
            <>
              Cancel journal entry update and return to the Journal Insights
              page for the entry.
            </>
          ),
          showControls: true,
          selector: '#button-cancel',
          side: isDesktop ? 'top' : 'top-left',
        },
        {
          icon: <Eraser />,
          title: 'Reset Entry',
          content: (
            <>Click to reset your entry to the previous journal entry.</>
          ),
          showControls: true,
          selector: '#button-reset',
          side: isDesktop ? 'top' : 'top-left',
        },
        {
          icon: <Save />,
          title: 'Submit Entry',
          content: (
            <>
              Click to submit your entry. Your entry will be analyzed by AI to
              detect your mood. Coping exercise will also be recommended based
              on the detected mood.
            </>
          ),
          showControls: true,
          selector: '#button-submit',
          side: 'top',
        },
        {
          icon: <Save />,
          title: 'Save Entry as Draft',
          content: (
            <>
              Click to save your entry as a draft. Your entry will <b>not</b> be
              analyzed to detect mood and recommend a coping exercise. You may
              revisit the draft entry through <b>Past Entry</b> page.
            </>
          ),
          showControls: true,
          selector: '#button-draft',
          side: isDesktop ? 'top' : 'top-right',
        },

        {
          icon: <Check />,
          title: 'Edit Journal',
          content: (
            <>
              That is all for the New Journal page! <br />
              Once you submit the new entry, your mood will be detected and a
              coping exercise will be recommended.
            </>
          ),
          showControls: true,
        },
      ],
    },
    {
      tour: 'past_entry',
      steps: [
        {
          icon: <Gem />,
          title: 'Past Journal Entry',
          content: <>View all of your past journal entries here.</>,
          showControls: true,
        },
        {
          icon: <CalendarDays />,
          title: 'Pick a Date',
          content: (
            <>
              Select a date using{' '}
              {isDesktop ? 'the calendar' : 'the date picker'} to show the
              journal entries.
            </>
          ),
          pointerPadding: 2,
          showControls: true,
          selector: isDesktop ? '#desktop-calendar' : '#mobile-date',
          side: isDesktop ? 'right' : 'bottom',
        },
        {
          icon: <NotebookText />,
          title: 'Journal Entries',
          content: (
            <>
              Your saved journal entries for the selected date are displayed
              here.
            </>
          ),
          pointerPadding: 5,
          selector: '#entry-list',
          side: isDesktop ? 'left' : 'top',
        },
        {
          icon: <NotebookText />,
          title: 'View Insights',
          content: (
            <>
              Click to view your journal entry details including the detected
              mood and recommended coping exercise here.
            </>
          ),
          selector: '#button-view-insights',
          side: isDesktop ? 'top' : 'top-left',
        },
        {
          icon: <PenLine />,
          title: 'Create New Journal Entry',
          content: <>Click to write a new journal entry.</>,
          selector: '#button-new-entry',
          pointerPadding: 5,
          side: 'bottom-right',
        },
        {
          icon: <Check />,
          title: 'Past Journal Entry',
          content: (
            <>
              That is all for the Past Journal Entry page! <br />
              Journal entries will be displayed here after your journal entry
              submissions.
            </>
          ),
          showControls: true,
        },
      ],
    },
    {
      tour: 'mood_charts',
      steps: [
        {
          icon: <Gem />,
          title: 'Mood Dashboard',
          content: <>View your moods summarized over time here.</>,
          showControls: true,
        },
        {
          icon: <CalendarDays />,
          title: 'Pick a Date Range',
          content: (
            <>
              Select a date range from the dropdown (7 days, 30 days, 3 months
              or custom). <br />
              When selecting <b>custom</b> range, select a start and end date to
              customize the chart.
            </>
          ),
          selector: '#select-date',
          pointerPadding: 10,
          side: 'bottom',
        },
        {
          icon: <ChartColumn />,
          title: 'Mood Bar Chart',
          content: (
            <>
              View your moods in a bar chart. <b>Hover</b> the bar to view the
              details of moods. <br />
              <b>Click</b> the bar to view the journal entry or past journal
              entries.
            </>
          ),
          selector: '#bar-chart',
          side: 'right',
          pointerPadding: 10,
        },
        {
          icon: <ChartScatter />,
          title: 'Mood Scatter Plot',
          content: (
            <>
              View your moods in a scatter plot. Each point represents a mood
              detected for each journal entry. <br /> <b>Hover</b> a point to
              view the mood and its timestamp. <b>Click</b> the point to view
              the journal entry.
            </>
          ),
          selector: '#scatter-plot',
          side: 'left',
          pointerPadding: 10,
        },
        {
          icon: <ChartScatter />,
          title: 'Daily Mood Scatter Plot',
          content: (
            <>
              View your daily moods in a scatter plot. Each point represents a
              mood detected for each journal entry. <br /> <b>Hover</b> a point
              to view the mood and its timestamp. <b>Click</b> the point to view
              the journal entry.
            </>
          ),
          selector: '#daily-scatter-plot',
          side: 'right',
          pointerPadding: 10,
        },
        {
          icon: <CalendarDays />,
          title: 'Pick a Date',
          content: (
            <>
              Select a date to view the daily mood scatter plot. All points
              represent the moods detected from the selected date&apos;s journal
              entries.
            </>
          ),
          selector: '#daily-date',
          pointerPadding: 5,
          side: isDesktop ? 'top' : 'top-right',
        },
        {
          icon: <CalendarDays />,
          title: 'Calendar Mood Heatmap',
          content: (
            <>
              View your moods represented in a heatmap for each date in the
              calendar. Select a date to view the journal entry or past journal
              entries.
            </>
          ),
          selector: '#mood-heatmap',
          side: 'left',
          pointerPadding: 5,
        },
        {
          icon: <Check />,
          title: 'Mood Dashboard',
          content: <>That is all for the Mood Dashboard page!</>,
          showControls: true,
        },
      ],
    },
    {
      tour: 'exc_track',
      steps: [
        {
          icon: <Gem />,
          title: 'Coping Exercise Tracking',
          content: <>View all of your recommended coping exercises here!</>,
          showControls: true,
        },
        {
          icon: <Flame />,
          title: 'Coping Exercise Streak',
          content: (
            <>
              View your current coping exercise streak here. Maintain them for
              streak badges!
            </>
          ),
          showControls: true,
          selector: '#streak',
          side: 'top',
          pointerPadding: 5,
        },
        {
          icon: <BicepsFlexed />,
          title: "Today's Exercise",
          content: <>View today&apos;s recommended coping exercise here.</>,
          selector: '#today-exercise',
          showControls: true,
          side: isDesktop ? undefined : 'top',
          pointerPadding: 3,
        },
        {
          icon: <Gem />,
          title: 'Coping Exercise',
          content: (
            <>
              Your rating or incompletion reason for the coping exercise is
              displayed here.
            </>
          ),
          selector: '#rating',
          showControls: true,
          side: 'top-left',
          pointerPadding: 20,
        },
        {
          icon: <BicepsFlexed />,
          title: 'Coping Exercise Details',
          content: <>View details of the recommended coping exercise here.</>,
          selector: '#button-exercise-details',
          showControls: true,
          side: 'top-left',
        },
        {
          icon: <Smile />,
          title: 'Journal Insights',
          content: (
            <>
              View details of the journal insights for the recommended coping
              exercise here.
            </>
          ),
          selector: '#button-insights',
          showControls: true,
          side: isDesktop ? 'top' : 'top-right',
        },
        {
          icon: <BicepsFlexed />,
          title: 'Recommended Coping Exercise History',
          content: (
            <>View all recommended coping exercises on a selected date here.</>
          ),
          selector: '#exercise-history',
          showControls: true,
          side: isDesktop ? undefined : 'top',
          pointerPadding: 1,
        },
        {
          icon: <CalendarDays />,
          title: 'Pick a Date',
          content: (
            <>
              Select a date using{' '}
              {isDesktop ? 'the calendar' : 'the date picker'} to view
              recommended coping exercises.
            </>
          ),
          pointerPadding: 2,
          showControls: true,
          selector: isDesktop ? '#desktop-calendar' : '#mobile-date',
          side: isDesktop ? 'right' : 'bottom',
        },
        {
          icon: <BicepsFlexed />,
          title: 'Recommended Coping Exercise History',
          content: (
            <>
              After selecting a date, your recommended coping exercises are
              displayed here.
            </>
          ),
          selector: '#exercise-history-list',
          showControls: true,
          pointerPadding: 10,
          side: isDesktop ? 'left' : 'top',
        },
        {
          icon: <Check />,
          title: 'Coping Exercise Tracking',
          content: <>That is all for the Coping Exercise Tracking page!</>,
          showControls: true,
        },
      ],
    },
    {
      tour: 'exc_catalog',
      steps: [
        {
          icon: <Gem />,
          title: 'Coping Exercise Catalog',
          content: <>Here is the coping exercises collection!</>,
          showControls: true,
        },
        {
          icon: <BicepsFlexed />,
          title: 'Coping Exercise',
          content: <>View all available coping exercises here.</>,
          showControls: true,
        },
        {
          icon: <Search />,
          title: 'Search Coping Exercise',
          content: (
            <>
              Search a coping exercise on this search bar. You may search using
              the coping exercise name.
            </>
          ),
          showControls: true,
          pointerPadding: 10,
          selector: isDesktop ? '#desktop-search' : '#mobile-search',
          side: isDesktop ? 'right' : 'bottom',
        },
        {
          icon: <Funnel />,
          title: 'Filter Coping Exercise',
          content: (
            <>
              Filter coping exercises based on their <b>Mood</b> and <b>Type</b>
              .
            </>
          ),
          showControls: true,
          selector: isDesktop ? '#desktop-dropdown' : '#mobile-dropdown',
          side: isDesktop ? 'right' : 'bottom',
        },
        {
          icon: <BicepsFlexed />,
          title: 'Coping Exercise',
          content: <>View a coping exercise with the tagged moods.</>,
          showControls: true,
          selector: '#exercise-card',
          side: 'bottom',
        },
        {
          icon: <BicepsFlexed />,
          title: 'Coping Exercise Details',
          content: <>View the details of the coping exercise here.</>,
          showControls: true,
          selector: '#button-view-exercise',
          side: isDesktop ? 'right' : 'top-left',
          pointerPadding: 5,
        },
        {
          icon: <Check />,
          title: 'Coping Exercise Catalog',
          content: <>That is all for the Coping Exercise Catalog page!</>,
          showControls: true,
        },
      ],
    },
    {
      tour: 'helpline',
      steps: [
        {
          icon: <Gem />,
          title: 'Emergency Helpline',
          content: (
            <>
              Here is a collection of emergency helplines available in Malaysia.
              Please contact a helpline when you are experiencing prolonged
              negative moods or in a poor well-being.
            </>
          ),
          showControls: true,
        },
      ],
    },
    {
      tour: 'profile',
      steps: [
        {
          icon: <Gem />,
          title: 'Profile',
          content: <>Here is your profile page.</>,
          showControls: true,
          prevRoute: '/helpline',
        },
        {
          icon: <User />,
          title: 'Profile Information',
          content: (
            <>
              View all profile information including your username name and
              email here.
            </>
          ),
          showControls: true,
          selector: '#profile',
          side: isDesktop ? undefined : 'bottom',
          pointerPadding: 5,
        },
        {
          icon: <User />,
          title: 'Update Name',
          content: (
            <>
              Update your preferred name here. Your new name will be displayed
              after updating it.
            </>
          ),
          showControls: true,
          selector: '#button-edit-name',
          side: 'top-left',
        },
        {
          icon: <User />,
          title: 'Delete Account',
          content: (
            <>
              Click to delete your account. <br />
              Deleting your account will remove all of your data including your
              moods and recommended coping exercises.
            </>
          ),
          showControls: true,
          selector: '#button-delete-account',
          side: 'top-left',
        },
        {
          icon: <Mail />,
          title: 'Email Notification',
          content: (
            <>
              Click to manage your email notification preference. You can choose
              to disable them anytime.
            </>
          ),
          showControls: true,
          selector: '#button-manage-notification',
          side: 'top-left',
        },
        {
          icon: <Download />,
          title: 'Download Journal Insights',
          content: (
            <>
              Click to download all past journal insight. You can download as a
              TXT file or PDF file.
            </>
          ),
          showControls: true,
          selector: '#button-download',
          side: 'top-left',
        },
        {
          icon: <Check />,
          title: 'Profile',
          content: <>That is all for the Profile page!</>,
          showControls: true,
        },
      ],
    },
    {
      tour: 'theme',
      steps: [
        {
          icon: <Gem />,
          title: 'Theme',
          content: (
            <>
              Here are the available color themes! Feel free to select a theme.
            </>
          ),
          showControls: true,
        },
        {
          icon: <Palette />,
          title: 'Color Theme',
          content: <>Select a theme to preview the colors.</>,
          showControls: true,
          selector: '#theme-list',
          side: 'bottom',
        },
        {
          icon: <Palette />,
          title: 'Theme Preview',
          content: (
            <>
              View the sample theme selected. You may try hovering the buttons
              or typing in the input!
            </>
          ),
          showControls: true,
          selector: '#theme-preview',
          side: 'top',
        },
        {
          icon: <Save />,
          title: 'Apply Theme',
          content: <>Click to apply the selected theme here.</>,
          showControls: true,
          selector: '#button-apply-theme',
          side: 'top-left',
          pointerPadding: 5,
        },
        {
          icon: <Trash />,
          title: 'Discard Change',
          content: <>Click to revert to the previous theme here.</>,
          showControls: true,
          selector: '#button-discard',
          side: isDesktop ? 'top' : 'top-right',
          pointerPadding: 10,
        },
        {
          icon: <Check />,
          title: 'Theme',
          content: (
            <>
              That is all for the Theme page! You may change the theme anytime.
            </>
          ),
          showControls: true,
        },
      ],
    },
  ];
}
