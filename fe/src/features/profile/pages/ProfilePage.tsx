import { useLanguage } from '@/hooks/useLanguage';
import { Avatar, Card, Heading, Message, Tabs } from '@/components/ui';
import { PasswordForm } from '@/features/auth/components/PasswordForm';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/services/user.service';
import { Check } from 'lucide-react';
import { useState } from 'react';
export function ProfilePage() {
  const { t } = useLanguage();

  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('Personal Info');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  return (
    <>
      <Heading
        title={t('Your Profile')}
        subtitle={t('A little about you. A journey that’s your own.')}
      />
      <Tabs
        values={['Personal Info', 'Goals', 'Preferences', 'Security']}
        value={tab}
        onChange={(v) => {
          setTab(v);
          setMessage('');
        }}
      />
      {tab === 'Security' ? (
        <PasswordForm />
      ) : (
        <div className="profile-layout">
          <Card className="profile-summary">
            <Avatar name={user!.name} image={user?.profile?.avatar} />
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="pill green">{t('Growing a little, every day')}</span>
            <div className="profile-quote">
              {t('Move.')}
              <br />
              {t('Improve.')}
              <br />
              <em>{t('Become.')}</em>
            </div>
          </Card>
          <Card>
            <h2>{t(tab)}</h2>
            <form
              key={`${tab}-${version}`}
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setMessage('');
                const f = new FormData(e.currentTarget);
                const profile: Record<string, unknown> = {};
                f.forEach((value, key) => {
                  if (key !== 'name' && key !== 'notifications' && value !== '')
                    profile[key] = ['age', 'height', 'weight', 'activity'].includes(key)
                      ? Number(value)
                      : value;
                });
                try {
                  setUser(
                    await userApi.updateProfile({
                      name: f.get('name') || user!.name,
                      profile,
                      ...(tab === 'Preferences'
                        ? { notifications: f.get('notifications') === 'on' }
                        : {}),
                    }),
                  );
                  setMessage('Your profile has been updated.');
                } catch (e) {
                  setMessage((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {tab === 'Personal Info' && (
                <>
                  <label>
                    {t('Full name')}
                    <input
                      name="name"
                      defaultValue={user?.name}
                      required
                      minLength={2}
                      maxLength={80}
                    />
                  </label>
                  <label>
                    {t('Email')}
                    <input type="email" value={user?.email || ''} disabled />
                    <span className="small">{t('Your sign-in email.')}</span>
                  </label>
                  <div className="grid two">
                    <label>
                      {t('Date of birth')}
                      <input
                        name="dob"
                        type="date"
                        defaultValue={user?.profile?.dob}
                        max={new Date().toISOString().slice(0, 10)}
                      />
                    </label>
                    <label>
                      {t('Location')}
                      <input
                        name="location"
                        defaultValue={user?.profile?.location}
                        maxLength={100}
                      />
                    </label>
                    {(['age', 'height', 'weight'] as const).map((k) => (
                      <label key={k}>
                        {t(k === 'height' ? 'Height (cm)' : k === 'weight' ? 'Weight (kg)' : 'Age')}
                        <input
                          name={k}
                          type="number"
                          defaultValue={user?.profile?.[k]}
                          min={k === 'age' ? 18 : k === 'height' ? 100 : 30}
                          max={k === 'age' ? 100 : k === 'height' ? 250 : 350}
                          step={k === 'age' ? 1 : 0.1}
                        />
                      </label>
                    ))}
                    <label>
                      {t('Sex used for calculation')}
                      <select name="gender" defaultValue={user?.profile?.gender || 'female'}>
                        <option value="female">{t('Female')}</option>
                        <option value="male">{t('Male')}</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    {t('Bio')}
                    <textarea
                      name="bio"
                      maxLength={500}
                      defaultValue={user?.profile?.bio}
                      placeholder={t('A little about your journey…')}
                    />
                  </label>
                  <label>
                    {t('Profile photo URL')}
                    <input
                      name="avatar"
                      type="url"
                      pattern="https://.*"
                      defaultValue={user?.profile?.avatar}
                      placeholder={t('https://…')}
                    />
                  </label>
                </>
              )}
              {tab === 'Goals' && (
                <>
                  <label>
                    {t('Your goal')}
                    <select name="goal" defaultValue={user?.profile?.goal || 'maintain'}>
                      <option value="lose">{t('Lose weight')}</option>
                      <option value="build">{t('Build muscle')}</option>
                      <option value="maintain">{t('Maintain fitness')}</option>
                      <option value="health">{t('Improve general health')}</option>
                    </select>
                  </label>
                  <label>
                    {t('Activity level')}
                    <select name="activity" defaultValue={user?.profile?.activity || 1.55}>
                      <option value={1.2}>{t('Sedentary')}</option>
                      <option value={1.375}>{t('Lightly active')}</option>
                      <option value={1.55}>{t('Moderately active')}</option>
                      <option value={1.725}>{t('Very active')}</option>
                    </select>
                  </label>
                  <p>{t('Update your nutrition calculation after changing your goals.')}</p>
                </>
              )}
              {tab === 'Preferences' && (
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="notifications"
                    defaultChecked={user?.notifications}
                  />
                  {t('Allow email updates from FitJourney')}
                </label>
              )}
              <Message text={message} />
              <div className="actions">
                <button className="primary" disabled={busy}>
                  <Check size={17} />
                  {t(busy ? 'Saving…' : 'Save changes')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVersion((v) => v + 1);
                    setMessage('');
                  }}
                >
                  {t('Cancel')}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
