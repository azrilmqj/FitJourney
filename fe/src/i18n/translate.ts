import { en } from './locales/en';
import { id } from './locales/id';
import type { Language, TranslationParams } from './types';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const templates = Object.keys(id)
  .filter((key) => key.includes('{{'))
  .map((key) => {
    const names: string[] = [];
    const expression = key
      .split(/(\{\{\w+\}\})/)
      .map((part) => {
        if (part.startsWith('{{')) {
          names.push(part.slice(2, -2));
          return '(.+?)';
        }
        return escapeRegex(part);
      })
      .join('');
    return { key, names, pattern: new RegExp(`^${expression}$`) };
  });

export function translate(language: Language, text: string, params?: TranslationParams): string {
  const dictionary = language === 'id' ? id : en;
  let translated = dictionary[text];
  let values = params;
  if (!translated && language === 'id') translated = dynamicTranslations[text];
  if (!translated && language === 'id') {
    for (const template of templates) {
      const match = text.match(template.pattern);
      if (match) {
        translated = dictionary[template.key];
        values = Object.fromEntries(
          template.names.map((name, index) => [
            name,
            ['level', 'category'].includes(name)
              ? dictionary[match[index + 1]] || match[index + 1]
              : match[index + 1],
          ]),
        );
        break;
      }
    }
  }
  return (translated || text).replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) =>
    values?.[name] === undefined ? placeholder : String(values[name]),
  );
}

const dynamicTranslations: Record<string, string> = {
  'Full Body HIIT': 'HIIT Seluruh Tubuh',
  'Core Strength, No Equipment': 'Kekuatan Inti Tanpa Alat',
  'Lower Body Power': 'Kekuatan Tubuh Bagian Bawah',
  'Morning Stretch & Reset': 'Peregangan dan Pemulihan Pagi',
  'Feel Good Cardio': 'Kardio yang Menyenangkan',
  'Everyday Mobility': 'Mobilitas Sehari-hari',
  'Small Habits. A Stronger You.': 'Kebiasaan Kecil, Diri yang Lebih Kuat.',
  'Make Your Plate More Colorful': 'Buat Piring Anda Lebih Berwarna',
  'Find Your Workout Rhythm': 'Temukan Ritme Latihan Anda',
  'A Calmer Evening Routine': 'Rutinitas Malam yang Lebih Tenang',
  'Celebrate the Small Wins': 'Rayakan Pencapaian Kecil',
  'Your Weekly Meal Planning Ritual': 'Kebiasaan Merencanakan Menu Mingguan',
  Lifestyle: 'Gaya hidup',
  Nutrition: 'Nutrisi',
  Workout: 'Latihan',
  Mindset: 'Pola pikir',
  Recovery: 'Pemulihan',
  Strength: 'Kekuatan',
  Cardio: 'Kardio',
  Flexibility: 'Kelenturan',
  Mobility: 'Mobilitas',
  Beginner: 'Pemula',
  Intermediate: 'Menengah',
  Advanced: 'Lanjutan',
  'Full body': 'Seluruh tubuh',
  Core: 'Otot inti',
  'Lower body': 'Tubuh bagian bawah',
  'Upper body': 'Tubuh bagian atas',
  'Warm up at your own pace': 'Lakukan pemanasan sesuai kemampuan Anda',
  'Follow the guided session': 'Ikuti sesi latihan terpandu',
  'Take breaks as needed': 'Beristirahatlah bila diperlukan',
  'Finish with a gentle cool down': 'Akhiri dengan pendinginan ringan',
  'Make time to move with this guided session. Work at a pace that feels comfortable, take breaks when needed, and focus on controlled movement.':
    'Luangkan waktu untuk bergerak dengan sesi terpandu ini. Berlatihlah dengan nyaman, istirahat bila perlu, dan fokus pada gerakan yang terkontrol.',
  'Build a routine that fits your real life, one small step at a time.':
    'Bangun rutinitas yang sesuai dengan keseharian Anda, selangkah demi selangkah.',
  'Simple inspiration for a more varied weekly menu.':
    'Inspirasi sederhana untuk menu mingguan yang lebih beragam.',
  'A little planning can make showing up feel simpler.':
    'Sedikit perencanaan dapat memudahkan Anda memulai.',
  'Create a little space to unwind at the end of your day.':
    'Luangkan waktu untuk bersantai di penghujung hari.',
  'Your journey is made of more than numbers.': 'Perjalanan Anda lebih dari sekadar angka.',
  'A practical approach to planning meals you look forward to.':
    'Cara praktis merencanakan hidangan yang Anda nantikan.',
  'Choose one small action you can comfortably repeat. Connect it to something you already do, such as a short walk after lunch.':
    'Pilih satu kebiasaan kecil yang mudah diulang. Kaitkan dengan rutinitas yang sudah ada, seperti berjalan kaki sebentar setelah makan siang.',
  'Write down what you did and how it felt. Your routine can change with your schedule. Make a plan you can return to.':
    'Catat kegiatan yang Anda lakukan dan rasanya. Rutinitas dapat menyesuaikan jadwal Anda. Buat rencana yang bisa Anda jalankan kembali.',
  'Write down a few meals you enjoy and choose different ingredients for the week.':
    'Catat beberapa hidangan yang Anda sukai dan pilih bahan yang beragam untuk minggu ini.',
  'Keep your favorite staples easy to reach. Try a new recipe, share a meal, and notice the flavors and textures you enjoy.':
    'Sediakan bahan makanan favorit agar mudah dijangkau. Coba resep baru, makan bersama, dan nikmati rasa serta tekstur yang Anda sukai.',
  'Look for a realistic opening in your week. Start with sessions you can fit into your schedule.':
    'Cari waktu yang realistis dalam jadwal mingguan Anda. Mulailah dengan sesi yang mudah diselipkan.',
  'Have your clothes, water, and equipment ready. Keep a short note after each session and adjust your routine to fit your life.':
    'Siapkan pakaian, air minum, dan perlengkapan. Buat catatan singkat setelah latihan dan sesuaikan rutinitas dengan keseharian Anda.',
  'Choose a quiet activity you enjoy, such as reading or writing a few lines in a journal.':
    'Pilih kegiatan tenang yang Anda sukai, seperti membaca atau menulis beberapa baris di jurnal.',
  'Put away work materials and make a short list for tomorrow. Notice which routines you enjoy and make them your own.':
    'Singkirkan pekerjaan dan buat daftar singkat untuk esok hari. Temukan rutinitas yang Anda sukai dan sesuaikan dengan diri Anda.',
  'Showing up and making time for yourself are moments worth recording.':
    'Meluangkan waktu untuk diri sendiri adalah hal yang patut dicatat.',
  'Write one thing you enjoyed this week and one thing you would like to try next. Give yourself room to learn and adjust.':
    'Catat satu hal yang Anda nikmati minggu ini dan satu hal yang ingin dicoba. Beri diri Anda ruang untuk belajar dan menyesuaikan diri.',
  'Consider which days you will cook and which days need a quicker option.':
    'Tentukan hari untuk memasak dan hari yang membutuhkan pilihan lebih praktis.',
  'Pick a few favorite meals and check what you already have before shopping. Keep a simple backup meal available for busy days.':
    'Pilih beberapa hidangan favorit dan periksa persediaan sebelum berbelanja. Siapkan makanan praktis untuk hari yang sibuk.',
  'Your full name': 'Nama lengkap Anda',
  'your-article-title': 'judul-artikel-anda',
  'Workout logged. A little stronger today!': 'Latihan tercatat. Hari ini Anda lebih kuat!',
  'Your profile has been updated.': 'Profil Anda telah diperbarui.',
  'Workout logged.': 'Latihan tercatat.',
  'YouTube URL or video ID': 'URL YouTube atau ID video',
  'YOUR JOURNEY · STEP': 'PERJALANAN ANDA · LANGKAH',
  'Let’s get to know you.': 'Mari berkenalan.',
  'What are you working toward?': 'Apa tujuan yang ingin Anda capai?',
  'You’re ready to begin.': 'Anda siap untuk memulai.',
  'Something went wrong.': 'Terjadi kesalahan.',
  'The server is unavailable. Please try again.': 'Server tidak tersedia. Silakan coba lagi.',
  'Email or password is incorrect.': 'Email atau kata sandi salah.',
  'Too many requests. Please try again later.': 'Terlalu banyak permintaan. Coba lagi nanti.',
  'Request failed. Please try again.': 'Permintaan gagal. Silakan coba lagi.',
};
