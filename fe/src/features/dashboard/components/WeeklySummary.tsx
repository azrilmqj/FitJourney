import { useLanguage } from '@/hooks/useLanguage';
import { Card, SectionTitle } from '@/components/ui';
import { ArrowUpRight, Dumbbell, Leaf, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { DashboardData } from '../hooks/useDashboardData';

export function WeeklySummary({ completed, week }: Pick<DashboardData, 'completed' | 'week'>) {
  const { t } = useLanguage();

  return (
    <div className="dashboard-middle">
      <Card>
        <SectionTitle>
          {t('Weekly momentum')}
          <Trophy size={17} />
        </SectionTitle>
        <div className="weekly-content">
          <div
            className="progress-ring"
            style={{
              background: `conic-gradient(#86b84c ${Math.min(completed / 5, 1) * 360}deg, #eef1eb 0)`,
            }}
          >
            <div>
              <strong>
                {completed}
                <span>/5</span>
              </strong>
              <small>{t('active days')}</small>
            </div>
          </div>
          <div>
            <h3>{t(completed ? 'Keep it going!' : 'A fresh start.')}</h3>
            <p>
              {t(completed ? 'You’re making time for you.' : 'Your next small win is waiting.')}
            </p>
            <span className="pill green">
              {Math.max(5 - completed, 0)}
              {t('days to your weekly goal')}
            </span>
          </div>
        </div>
        <div className="week-dots">
          {week.map((d, i) => (
            <div key={i}>
              <span className={d.minutes ? 'complete' : ''}>{t(d.minutes ? '✓' : '')}</span>
              <small>{d.day.slice(0, 1)}</small>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionTitle to="/progress">{t('Weekly activity')}</SectionTitle>
        <div className="chart-value">
          <strong>
            {week.reduce((s, d) => s + d.minutes, 0)}
            <small>{t('min')}</small>
          </strong>
          <span>{t('Movement this week')}</span>
        </div>
        <div className="mini-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week} barSize={20}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#777' }}
              />
              <Tooltip cursor={{ fill: '#f6f8f9' }} />
              <Bar dataKey="minutes" fill="#a9ddec" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="focus-card">
        <SectionTitle to="/workouts">{t('A balanced you')}</SectionTitle>
        <span className="small">{t('Good things come together.')}</span>
        <div className="focus-content">
          <div className="body-symbol">
            <Dumbbell size={45} strokeWidth={1} />
            <Leaf size={48} strokeWidth={1} />
          </div>
          <div>
            <Link to="/workouts" className="pill blue">
              {t('Move with purpose')}
              <ArrowUpRight size={12} />
            </Link>
            <Link to="/nutrition" className="pill green">
              {t('Fuel your potential')}
              <ArrowUpRight size={12} />
            </Link>
            <Link to="/articles" className="pill peach">
              {t('Care for your mind')}
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
