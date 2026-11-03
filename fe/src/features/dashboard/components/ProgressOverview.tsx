import { useLanguage } from '@/hooks/useLanguage';
import { Card, Empty, SectionTitle } from '@/components/ui';
import { ArrowRight, Flame, Leaf, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardData } from '../hooks/useDashboardData';

export function ProgressOverview({
  progress,
  latest,
  target,
}: Pick<DashboardData, 'progress' | 'latest' | 'target'>) {
  const { t, locale } = useLanguage();

  const UtensilsIcon = Leaf;
  return (
    <div className="dashboard-bottom">
      <Card>
        <SectionTitle to="/progress">{t('Your weight journey')}</SectionTitle>
        {progress.data?.length ? (
          <>
            <div className="chart-value">
              <strong>
                {latest?.weight}
                <small>{t('kg')}</small>
              </strong>
              <span>
                {t('Latest check-in ·')}
                {latest?.date}
              </span>
            </div>
            <div className="weight-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progress.data}>
                  <defs>
                    <linearGradient id="weight-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bfe8f5" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#bfe8f5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f1" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => v.slice(5)}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    domain={['dataMin - 2', 'dataMax + 2']}
                    width={35}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#39a9d0"
                    strokeWidth={2.5}
                    fill="url(#weight-fill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <Empty
            title={t('Every journey has a beginning')}
            description={t('Log your first check-in and watch your progress grow.')}
          >
            <Link to="/progress" className="button secondary">
              {t('Add your first check-in')}
              <Plus size={15} />
            </Link>
          </Empty>
        )}
      </Card>
      <Card className="nutrition-summary">
        <SectionTitle to="/nutrition">{t('Fuel your day')}</SectionTitle>
        <span className="small">{t('Your personal daily targets')}</span>
        {target ? (
          <>
            <div className="nutrition-total">
              <Flame />
              <strong>{target.calories.toLocaleString(locale)}</strong>
              <span>{t('kcal / day')}</span>
            </div>
            {(['protein', 'carbs', 'fat'] as const).map((key, i) => (
              <div className="macro-row" key={key}>
                <span className={`macro-dot ${['green', 'blue', 'peach'][i]}`} />
                <span>{key}</span>
                <strong>{target[key]} g</strong>
              </div>
            ))}
          </>
        ) : (
          <div className="empty">
            <UtensilsIcon />
            <h3>{t('A little guidance for your plate.')}</h3>
            <p>{t('Calculate your personalized nutrition targets.')}</p>
            <Link to="/nutrition" className="button primary">
              {t('Find my balance')}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
