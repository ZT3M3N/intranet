// src/hooks/useAnnouncements.ts
import { useState, useEffect } from 'react';
import { AnnouncementModel } from '@/models/Announcement';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      if (!response.ok) throw new Error('Error fetching announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (announcement: Omit<AnnouncementModel, '_id' | 'comments' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
      if (!response.ok) throw new Error('Error creating announcement');
      await fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const addComment = async (announcementId: string, comment: { name: string; area: string; comment: string }) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      if (!response.ok) throw new Error('Error adding comment');
      await fetchAnnouncements();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return {
    announcements,
    loading,
    error,
    addAnnouncement,
    addComment,
    refreshAnnouncements: fetchAnnouncements,
  };
}
