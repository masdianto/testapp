import React, { useState, useMemo, useEffect } from 'react';
import { Member, MemberStatus, EmergencyDirective, News, TaskReport, SPPD } from '../../types';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import DirectiveDetailModal from './DirectiveDetailModal';
import { getUrgencyClass, getTaskReportStatusClass, formatDateRelative } from '../../utils';
import NewsDetailModal from './NewsDetailModal';
import NewspaperIcon from '../icons/NewspaperIcon';
import GlobeAltIcon from '../icons/GlobeAltIcon';
import UserCircleIcon from '../icons/UserCircleIcon';
import ClipboardDocumentListIcon from '../icons/ClipboardDocumentListIcon';
import PaperAirplaneIcon from '../icons/PaperAirplaneIcon';


interface MemberHomePageProps {
  member: Member;
  allMembers: Member[];
  news: News[];
  directives: EmergencyDirective[];
  taskReports: TaskReport[];
  sppds: SPPD[];
  onNavigate: (page: 'card' | 'profile' | 'about') => void;
  onAcknowledgeTask: (directiveId: string) => void;
  onSaveTaskReport: (directiveId: string, reportText: string, reportImageUrl?: string) => Promise<void>;
  isLoading: boolean;
  onSppdClick: (sppd: SPPD) => void;
}

const MemberHomePage: React.FC<MemberHomePageProps> = ({ 
    member, 
    allMembers, 
    news,
    directives,
    taskReports,
    sppds,
    onNavigate,
    onAcknowledgeTask,
    onSaveTaskReport,
    isLoading,
    onSppdClick
}) => {
  const [selectedDirective, setSelectedDirective] = useState<EmergencyDirective | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [activeTaskTab, setActiveTaskTab] = useState<'general' | 'personal' | 'sppd'>('general');

  const generalDirectives = useMemo(() => {
    return directives.filter(d => d.assignedTo === 'all');
  }, [directives]);

  const personalDirectives = useMemo(() => {
    return directives.filter(d => Array.isArray(d.assignedTo) && d.assignedTo.includes(member.id));
  }, [member.id, directives]);
  
  const mySppdTasks = useMemo(() => {
      return sppds.filter(s => s.status === 'Disetujui' && s.penerimaTugasIds.includes(member.id));
  }, [sppds, member.id]);

  const sortedNews = useMemo(() => 
    [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [news]);

  useEffect(() => {
    if (sortedNews.length > 1) {
        const sliderInterval = setInterval(() => {
            setCurrentNewsIndex(prevIndex => (prevIndex + 1) % sortedNews.length);
        }, 5000);
        return () => clearInterval(sliderInterval);
    }
  }, [sortedNews.length]);

  const renderDirectiveList = (directiveList: EmergencyDirective[]) => {
      return directiveList.map((directive) => {
        const taskReport = taskReports.find(r => r.directiveId === directive.id && r.memberId === member.id);
        const reportStatus = taskReport?.status || 'Perlu Dilihat';
        return (
            <button 
                key={directive.id} 
                onClick={() => setSelectedDirective(directive)}
                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
                aria-label={`Lihat detail untuk ${directive.title}`}
            >
                <div className="flex-grow">
                <p className="font-semibold text-gray-900 dark:text-white">{directive.title}</p>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyClass(directive.urgency)}`}>
                      {directive.urgency}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskReportStatusClass(reportStatus)}`}>
                      {reportStatus}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateRelative(directive.date)}</span>
                </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
            </button>
        )
    })
  }

  const NoTasksMessage: React.FC<{message: string}> = ({message}) => (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p>{message}</p>
    </div>
  );
  
  return (
    <>
      <div className="flex flex-col h-full text-gray-800 dark:text-gray-200">
        <div className="p-6">
            <header className="flex items-center gap-4">
              <img src={member.fotoUrl} alt={member.namaLengkap} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Selamat datang,</p>
                <h1 className="text-2xl font-bold">{member.namaLengkap}</h1>
              </div>
            </header>
        </div>
        
        <div className="flex flex-col flex-grow min-h-0 px-6 pb-24 space-y-6">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-3 flex-shrink-0">
                  <NewspaperIcon className="w-6 h-6 text-primary" />
                  Berita Terkini
              </h2>
               <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-md bg-gray-700">
                  {sortedNews.map((newsItem, index) => (
                      <div
                          key={newsItem.id}
                          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentNewsIndex ? 'opacity-100' : 'opacity-0'}`}
                      >
                          <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-3 text-white">
                              <span className="text-xs font-semibold uppercase px-2 py-0.5 bg-primary/80 rounded mb-1 inline-block">{newsItem.category}</span>
                              <h3 className="font-bold">{newsItem.title}</h3>
                              <button onClick={() => setSelectedNews(newsItem)} className="text-sm mt-1 text-yellow-300 font-semibold">
                                Baca Selengkapnya
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-3 flex-shrink-0">
                  <ClipboardDocumentListIcon className="w-6 h-6 text-primary" />
                  Daftar Tugas
              </h2>
              
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1 mb-2">
                <button 
                  onClick={() => setActiveTaskTab('general')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTaskTab === 'general' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}
                >
                  <GlobeAltIcon className="w-5 h-5"/>
                  Tugas Umum
                </button>
                <button 
                  onClick={() => setActiveTaskTab('personal')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTaskTab === 'personal' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}
                >
                  <UserCircleIcon className="w-5 h-5"/>
                  Tugas Pribadi
                </button>
                <button 
                  onClick={() => setActiveTaskTab('sppd')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTaskTab === 'sppd' ? 'bg-white dark:bg-gray-900 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800'}`}
                >
                  <PaperAirplaneIcon className="w-5 h-5"/>
                  SPPD
                </button>
              </div>

              <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm max-h-48 overflow-y-auto">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {activeTaskTab === 'general' && (
                        generalDirectives.length > 0 ? renderDirectiveList(generalDirectives) : <NoTasksMessage message="Tidak ada perintah tugas umum saat ini." />
                      )}
                      {activeTaskTab === 'personal' && (
                        personalDirectives.length > 0 ? renderDirectiveList(personalDirectives) : <NoTasksMessage message="Tidak ada perintah tugas pribadi untuk Anda." />
                      )}
                      {activeTaskTab === 'sppd' && (
                        mySppdTasks.length > 0 ? mySppdTasks.map(sppd => (
                            <button 
                                key={sppd.id} 
                                onClick={() => onSppdClick(sppd)}
                                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
                            >
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900 dark:text-white">{sppd.untuk}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{sppd.tujuan}</p>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                            </button>
                        )) : <NoTasksMessage message="Tidak ada perjalanan dinas yang ditugaskan untuk Anda." />
                      )}
                  </div>
              </div>
            </div>
        </div>
      </div>
      {selectedDirective && (
        <DirectiveDetailModal
          directive={selectedDirective}
          allMembers={allMembers}
          onClose={() => setSelectedDirective(null)}
          loggedInMember={member}
          taskReports={taskReports}
          onAcknowledgeTask={onAcknowledgeTask}
          onSaveTaskReport={onSaveTaskReport}
          isLoading={isLoading}
        />
      )}
      {selectedNews && (
          <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
};

export default MemberHomePage;