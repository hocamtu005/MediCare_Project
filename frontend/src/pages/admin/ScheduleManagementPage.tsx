import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, User, Save, Trash2, Clock, ChevronLeft, ChevronRight, CalendarDays, Plus, Building2, DoorOpen, History, Stethoscope, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';

import { getAllSchedules, createSchedule, deleteSchedule, getStaffList, getClinics, getRooms } from '../../services/adminService';

// ---------- Helpers ----------
type ShiftStatus = 'UPCOMING' | 'ONGOING' | 'DONE';

const STATUS_STYLE: Record<ShiftStatus, { label: string; badge: string; dot: string; bg: string; border: string; text: string }> = {
  UPCOMING: { label: 'Sắp diễn ra', badge: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500', bg: '#EFF6FF', border: '#bfdbfe', text: '#1e40af' },
  ONGOING: { label: 'Đang diễn ra', badge: 'bg-purple-50 text-purple-600 border-purple-200', dot: 'bg-purple-500', bg: '#FAF5FF', border: '#e9d5ff', text: '#6b21a8' },
  DONE: { label: 'Đã kết thúc', badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', bg: '#F8FAFC', border: '#e2e8f0', text: '#475569' },
};

const hhmm = (t: string) => (t || '').slice(0, 5);
const toDate = (d: string, t: string) => new Date(`${d}T${hhmm(t)}:00`);
const minutesBetween = (s: string, e: string) => {
  const [sh, sm] = hhmm(s).split(':').map(Number);
  const [eh, em] = hhmm(e).split(':').map(Number);
  return eh * 60 + em - (sh * 60 + sm);
};
const formatDuration = (min: number) => {
  if (min <= 0) return '—';
  const h = Math.floor(min / 60), m = min % 60;
  return `${h ? `\${h} giờ` : ''}${h && m ? ' ' : ''}${m ? `\${m} phút` : ''}`;
};
const getStatus = (s: any): ShiftStatus => {
  const now = new Date();
  if (now < toDate(s.workDate, s.startTime)) return 'UPCOMING';
  if (now <= toDate(s.workDate, s.endTime)) return 'ONGOING';
  return 'DONE';
};
const fmtDate = (d: string) => format(new Date(`${d}T00:00:00`), 'dd/MM/yyyy');

export default function ScheduleManagementPage() {
  const calendarRef = useRef<any>(null);

  const [schedules, setSchedules] = useState<any[]>([]);
  // Gộp chung Bác sĩ và Điều dưỡng
  const [staffs, setStaffs] = useState<any[]>([]); 
  const [clinics, setClinics] = useState<any[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [tab, setTab] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
  const [listFilter, setListFilter] = useState<'UPCOMING' | 'HISTORY' | 'ALL'>('UPCOMING');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');

  const [calendarTitle, setCalendarTitle] = useState('');
  const [currentView, setCurrentView] = useState('timeGridWeek');

  const [form, setForm] = useState({
    doctorId: '', // Vẫn giữ key này để gửi API
    clinicId: '',
    roomId: '',
    workDate: '',
    startTime: '08:00',
    endTime: '12:00',
    slotDuration: '30'
  });

  // State phụ để biết nhân sự đang chọn là ai
  const [selectedStaffRole, setSelectedStaffRole] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [scheduleData, staffData, clinicData] = await Promise.all([
        getAllSchedules(), getStaffList(), getClinics()
      ]);
      setSchedules(scheduleData);
      // Lọc lấy cả DOCTOR và RECEPTIONIST
      setStaffs(staffData.filter((u: any) => (u.role === 'DOCTOR' || u.role === 'RECEPTIONIST') && (u.active || u.isActive)));
      setClinics(clinicData.filter((c: any) => c.active || c.isActive));
    } catch (error) {
      toast.error("Lỗi tải dữ liệu hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffChange = (staffId: string) => {
    const s = staffs.find(x => x.id === staffId);
    setSelectedStaffRole(s ? s.role : '');
    setForm({ ...form, doctorId: staffId });
  };

  const handleClinicChange = async (clinicId: string) => {
    setForm({ ...form, clinicId, roomId: '' });
    try {
      const rooms = await getRooms(clinicId);
      setAvailableRooms(rooms);
    } catch (error) {
      toast.error("Lỗi tải danh sách phòng");
    }
  };

  const filtered = useMemo(() => schedules.filter(s =>
    (!doctorFilter || s.doctorName === doctorFilter) && (!clinicFilter || s.clinicName === clinicFilter)
  ), [schedules, doctorFilter, clinicFilter]);

  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const in7 = format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd');
    return {
      today: filtered.filter(s => s.workDate === today).length,
      ongoing: filtered.filter(s => getStatus(s) === 'ONGOING').length,
      next7: filtered.filter(s => getStatus(s) === 'UPCOMING' && s.workDate <= in7).length,
      done: filtered.filter(s => getStatus(s) === 'DONE').length,
    };
  }, [filtered]);

  const listRows = useMemo(() => {
    const rows = filtered.filter(s => {
      const st = getStatus(s);
      if (listFilter === 'UPCOMING') return st !== 'DONE';
      if (listFilter === 'HISTORY') return st === 'DONE';
      return true;
    });
    const key = (s: any) => `${s.workDate}T${hhmm(s.startTime)}`;
    return rows.sort((a, b) => listFilter === 'HISTORY' ? key(b).localeCompare(key(a)) : key(a).localeCompare(key(b)));
  }, [filtered, listFilter]);

  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);
    const isAllDay = selectInfo.allDay;

    if (endDate.getTime() < Date.now() && !isAllDay) {
      toast.error("Không thể phân công ca trực trong quá khứ");
      return;
    }
    setForm({
      ...form,
      workDate: format(startDate, 'yyyy-MM-dd'),
      startTime: isAllDay ? '08:00' : format(startDate, 'HH:mm'),
      endTime: isAllDay ? '12:00' : format(endDate, 'HH:mm')
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const found = schedules.find(s => String(s.id) === String(clickInfo.event.id));
    if (found) openDetail(found);
  };

  const openDetail = (shift: any) => {
    setConfirmingDelete(false);
    setSelectedShift(shift);
  };

  const openCreate = () => {
    setForm(f => ({ ...f, workDate: f.workDate || format(new Date(), 'yyyy-MM-dd') }));
    setIsModalOpen(true);
  };

  const changeView = (viewName: string) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewName);
      setCurrentView(viewName);
    }
  };

  const navigateCalendar = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      if (action === 'PREV') api.prev();
      if (action === 'NEXT') api.next();
      if (action === 'TODAY') api.today();
    }
  };

  const jumpToDate = (dateStr: string) => {
    if (calendarRef.current && dateStr) {
      calendarRef.current.getApi().gotoDate(dateStr);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minutesBetween(form.startTime, form.endTime) <= 0) {
      toast.error("Giờ kết thúc phải sau giờ bắt đầu");
      return;
    }
    
    // Tạo payload mới, nếu là Điều dưỡng thì không gửi slotDuration
    const payload = { ...form };
    if (selectedStaffRole === 'RECEPTIONIST') {
      payload.slotDuration = ''; 
    }

    toast.loading("Đang xếp lịch...", { id: "action" });
    try {
      await createSchedule(payload);
      toast.success("Đã tạo lịch trực thành công!", { id: "action" });
      setIsModalOpen(false);
      setForm({ ...form, doctorId: '', roomId: '' });
      setSelectedStaffRole('');
      setSchedules(await getAllSchedules());
    } catch (error: any) {
      toast.error(error.response?.data || "Lỗi tạo lịch trực", { id: "action" });
    }
  };

  const handleDelete = async (id: string) => {
    toast.loading("Đang hủy lịch...", { id: "action" });
    try {
      await deleteSchedule(id);
      toast.success("Hủy thành công!", { id: "action" });
      setSelectedShift(null);
      setConfirmingDelete(false);
      setSchedules(await getAllSchedules());
    } catch (error: any) {
      toast.error(error.response?.data || "Lỗi hủy lịch", { id: "action" });
    }
  };

  const getEventColor = (str: string) => {
    const colors = [
      { bg: '#FFF0F2', border: '#FFE4E6', text: '#BE123C' },
      { bg: '#F5F3FF', border: '#EDE9FE', text: '#6D28D9' },
      { bg: '#FEF3C7', border: '#FDE68A', text: '#B45309' },
      { bg: '#ECFEFF', border: '#CFFAFE', text: '#0F766E' },
      { bg: '#F0FDF4', border: '#DCFCE7', text: '#15803D' },
      { bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const calendarEvents = filtered.map(sch => {
    const st = STATUS_STYLE[getStatus(sch)];
    const isUpcoming = getStatus(sch) === 'UPCOMING';
    const customColor = isUpcoming ? getEventColor(sch.doctorName) : null;
    const prefix = sch.role === 'RECEPTIONIST' ? 'ĐD. ' : 'BS. ';

    return {
      id: sch.id,
      title: `${prefix}${sch.doctorName}`,
      start: `${sch.workDate}T${hhmm(sch.startTime)}:00`,
      end: `${sch.workDate}T${hhmm(sch.endTime)}:00`,
      extendedProps: { room: sch.roomName, clinic: sch.clinicName },
      backgroundColor: customColor ? customColor.bg : st.bg,
      borderColor: customColor ? customColor.border : st.border,
      textColor: customColor ? customColor.text : st.text
    };
  });

  const renderEventContent = (eventInfo: any) => (
    <div className="p-1 overflow-hidden h-full flex flex-col justify-start">
      <div className="font-bold text-[11px] truncate mb-0.5">{eventInfo.event.title}</div>
      {currentView !== 'dayGridMonth' && (
        <>
          <div className="text-[10px] opacity-80 truncate flex items-center gap-1"><Clock className="w-2.5 h-2.5 shrink-0" /> {eventInfo.timeText}</div>
          <div className="text-[9px] font-medium truncate mt-0.5 opacity-90">{eventInfo.event.extendedProps.room}</div>
        </>
      )}
    </div>
  );

  const formMinutes = minutesBetween(form.startTime, form.endTime);
  const formSlots = formMinutes > 0 ? Math.floor(formMinutes / Number(form.slotDuration)) : 0;

  const StatusBadge = ({ shift }: { shift: any }) => {
    const st = STATUS_STYLE[getStatus(shift)];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${st.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${st.dot} animate-pulse`} /> {st.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-10 max-w-7xl mx-auto">
      <Toaster position="top-right"/>

      <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-slate-200 flex flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-xl"></div>
        <div className="pl-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Phân công Lịch trực</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Sắp xếp ca khám, theo dõi tiến độ và xem lại lịch sử làm việc.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={openCreate} className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold hover:bg-primary-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Thêm ca trực
          </button>
          <div className="bg-primary-50 p-2 rounded-lg border border-primary-100 hidden sm:block">
            <CalendarDays className="w-5 h-5 text-primary-600" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-2 text-primary-600">
          <Clock className="w-6 h-6 animate-spin" />
          <span className="text-xs font-medium">Đang tải dữ liệu lịch...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Ca hôm nay', value: stats.today, icon: CalendarDays, color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Đang diễn ra', value: stats.ongoing, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Sắp tới (7 ngày)', value: stats.next7, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Đã hoàn thành', value: stats.done, icon: History, color: 'text-slate-600', bg: 'bg-slate-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                 <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}>
                   <s.icon className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                   <p className={`text-xl font-bold mt-0.5 text-slate-800`}>{s.value}</p>
                 </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 mb-5 border-b border-slate-100 pb-4">
              <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start">
                <button onClick={() => setTab('CALENDAR')} className={`px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${tab === 'CALENDAR' ? 'bg-white shadow-sm text-primary-600 ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}><CalendarDays className="w-3.5 h-3.5" /> Lịch</button>
                <button onClick={() => setTab('LIST')} className={`px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${tab === 'LIST' ? 'bg-white shadow-sm text-primary-600 ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}><History className="w-3.5 h-3.5" /> Dạng danh sách</button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <select value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white outline-none focus:border-primary-500 font-medium text-slate-700">
                  <option value="">Tất cả nhân sự</option>
                  {staffs.map(d => <option key={d.id} value={d.fullName}>{d.role === 'RECEPTIONIST' ? 'ĐD.' : 'BS.'} {d.fullName}</option>)}
                </select>
                <select value={clinicFilter} onChange={e => setClinicFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white outline-none focus:border-primary-500 font-medium text-slate-700">
                  <option value="">Tất cả cơ sở</option>
                  {clinics.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                {(doctorFilter || clinicFilter) && (
                  <button onClick={() => { setDoctorFilter(''); setClinicFilter(''); }} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">Xóa lọc</button>
                )}
              </div>
            </div>

            {tab === 'CALENDAR' ? (
              <>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5">
                      <button onClick={() => navigateCalendar('PREV')} className="p-1.5 hover:bg-white rounded text-slate-600 transition-colors shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                      <button onClick={() => navigateCalendar('TODAY')} className="px-3 py-1 hover:bg-white rounded text-xs font-bold text-slate-700 transition-colors">Hôm nay</button>
                      <button onClick={() => navigateCalendar('NEXT')} className="p-1.5 hover:bg-white rounded text-slate-600 transition-colors shadow-sm"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none"><CalendarDays className="w-3.5 h-3.5 text-slate-400" /></div>
                      <input type="date" onChange={(e) => jumpToDate(e.target.value)} className="pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium outline-none cursor-pointer hover:bg-white transition-colors" title="Đi tới ngày" />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-slate-800 capitalize text-center flex-1">{calendarTitle}</h2>

                  <div className="flex items-center bg-slate-50 p-0.5 rounded-lg border border-slate-200 w-full md:w-auto justify-center">
                    {[['dayGridMonth', 'Tháng'], ['timeGridWeek', 'Tuần'], ['timeGridDay', 'Ngày']].map(([v, label]) => (
                      <button key={v} onClick={() => changeView(v)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${currentView === v ? 'bg-white shadow-sm text-primary-600 ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="fc-custom-wrapper border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    locale={viLocale}
                    headerToolbar={false}
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}
                    nowIndicator={true}
                    height="700px"
                    events={calendarEvents}
                    selectable={true}
                    selectMirror={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                    datesSet={(arg) => {
                      setCalendarTitle(arg.view.title);
                      setCurrentView(arg.view.type);
                    }}
                  />
                </div>
                <p className="text-center text-xs text-slate-400 mt-3 font-medium">Kéo chọn vùng trống trên lịch để tạo ca trực nhanh · Click vào ca để xem chi tiết</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  {([['UPCOMING', 'Đang & Sắp diễn ra'], ['HISTORY', 'Lịch sử'], ['ALL', 'Tất cả']] as const).map(([v, label]) => (
                    <button key={v} onClick={() => setListFilter(v)} className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors border ${listFilter === v ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{label}</button>
                  ))}
                  <span className="ml-auto text-xs text-slate-400 font-medium">{listRows.length} kết quả</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Ngày</th>
                        <th className="px-5 py-3 font-semibold">Giờ trực</th>
                        <th className="px-5 py-3 font-semibold">Nhân sự</th>
                        <th className="px-5 py-3 font-semibold">Cơ sở / Phòng</th>
                        <th className="px-5 py-3 font-semibold">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {listRows.length === 0 ? (
                        <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                          {listFilter === 'HISTORY' ? 'Chưa có dữ liệu ca trực lưu trữ.' : 'Không có ca trực phù hợp.'}
                        </td></tr>
                      ) : listRows.map(s => (
                        <tr key={s.id} onClick={() => openDetail(s)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                          <td className="px-5 py-3 font-medium text-slate-800 whitespace-nowrap"><CalendarDays className="w-3.5 h-3.5 inline-block mr-1.5 text-slate-400"/> {fmtDate(s.workDate)}</td>
                          <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{hhmm(s.startTime)} – {hhmm(s.endTime)}</td>
                          <td className="px-5 py-3 text-slate-800 font-semibold flex items-center gap-2">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${s.role === 'RECEPTIONIST' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'}`}><User className="w-3 h-3"/></div>
                             {s.role === 'RECEPTIONIST' ? 'ĐD.' : 'BS.'} {s.doctorName}
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-slate-700 font-medium text-xs truncate max-w-[150px]" title={s.clinicName}>{s.clinicName}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{s.roomName}</p>
                          </td>
                          <td className="px-5 py-3 flex items-center justify-between">
                            <StatusBadge shift={s} />
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all"/>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* DRAWER CHI TIẾT CA TRỰC */}
      <AnimatePresence>
        {selectedShift && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setSelectedShift(null)} />
            <motion.aside initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} transition={{ duration: 0.2 }} className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
              <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-primary-600"/> Chi tiết Phân công</h3>
                  <div className="mt-2"><StatusBadge shift={selectedShift} /></div>
                </div>
                <button onClick={() => setSelectedShift(null)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 p-1 rounded-md transition-colors shadow-sm"><X className="w-4 h-4" /></button>
              </div>

              <div className="p-6 space-y-5 flex-1 overflow-y-auto bg-white">
                <div className={`flex items-center gap-4 p-4 rounded-xl border ${selectedShift.role === 'RECEPTIONIST' ? 'bg-teal-50/50 border-teal-100/50' : 'bg-indigo-50/50 border-indigo-100/50'}`}>
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border ${selectedShift.role === 'RECEPTIONIST' ? 'text-teal-600 border-teal-100' : 'text-indigo-600 border-indigo-100'}`}><User className="w-5 h-5"/></div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${selectedShift.role === 'RECEPTIONIST' ? 'text-teal-400' : 'text-indigo-400'}`}>{selectedShift.role === 'RECEPTIONIST' ? 'Điều dưỡng' : 'Bác sĩ phụ trách'}</p>
                    <p className={`font-bold text-base ${selectedShift.role === 'RECEPTIONIST' ? 'text-teal-900' : 'text-indigo-900'}`}>{selectedShift.role === 'RECEPTIONIST' ? 'ĐD.' : 'BS.'} {selectedShift.doctorName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5"><Clock className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Thời gian trực</p>
                      <p className="text-sm font-bold text-slate-800">{fmtDate(selectedShift.workDate)}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{hhmm(selectedShift.startTime)} – {hhmm(selectedShift.endTime)} <span className="text-slate-400 font-medium">({formatDuration(minutesBetween(selectedShift.startTime, selectedShift.endTime))})</span></p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5"><Building2 className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Địa điểm</p>
                      <p className="text-sm font-bold text-slate-800">{selectedShift.clinicName}</p>
                      <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1"><DoorOpen className="w-3 h-3"/> {selectedShift.roomName}</p>
                    </div>
                  </div>

                  {selectedShift.slotDuration && selectedShift.role === 'DOCTOR' && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5"><Stethoscope className="w-4 h-4"/></div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Chỉ tiêu khám</p>
                        <p className="text-sm font-bold text-slate-800">{selectedShift.slotDuration} phút / lượt</p>
                        <p className="text-xs text-slate-600 mt-0.5">Khoảng {Math.floor(minutesBetween(selectedShift.startTime, selectedShift.endTime) / Number(selectedShift.slotDuration))} lượt khám trong ca</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50">
                {getStatus(selectedShift) === 'DONE' ? (
                  <p className="text-xs text-slate-500 font-medium text-center bg-slate-200/50 py-2 rounded-lg">Ca trực đã lưu vào lịch sử, không thể chỉnh sửa.</p>
                ) : confirmingDelete ? (
                  <div className="space-y-3">
                    <p className="text-xs text-rose-600 font-medium text-center">Xóa ca trực này? Thao tác không thể hoàn tác.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmingDelete(false)} className="flex-1 px-3 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors">Hủy</button>
                      <button onClick={() => handleDelete(selectedShift.id)} className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"><Trash2 className="w-3.5 h-3.5" /> Xác nhận xóa</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setConfirmingDelete(true)} className="w-full px-4 py-2 text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /> Thu hồi ca trực</button>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL PHÂN CÔNG */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary-600"/> PHÂN CÔNG CA TRỰC MỚI</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 p-1 rounded-md transition-colors shadow-sm"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreate} className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">1. Nhân sự & Địa điểm</p>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Nhân sự phụ trách <span className="text-rose-500">*</span></label>
                      <select required value={form.doctorId} onChange={e => handleStaffChange(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-primary-500 text-sm font-medium text-slate-700 transition-colors">
                        <option value="" disabled>-- Chọn nhân sự --</option>
                        {staffs.map(d => <option key={d.id} value={d.id}>{d.role === 'RECEPTIONIST' ? 'ĐD.' : 'BS.'} {d.fullName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Cơ sở <span className="text-rose-500">*</span></label>
                      <select required value={form.clinicId} onChange={e => handleClinicChange(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-primary-500 text-sm font-medium text-slate-700 transition-colors">
                        <option value="" disabled>-- Chọn chi nhánh --</option>
                        {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phòng / Khu vực <span className="text-rose-500">*</span></label>
                      <select required value={form.roomId} onChange={e => setForm({ ...form, roomId: e.target.value })} disabled={!form.clinicId || availableRooms.length === 0} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-primary-500 text-sm font-medium disabled:opacity-50 transition-colors">
                        <option value="" disabled>{!form.clinicId ? 'Chọn cơ sở trước' : availableRooms.length === 0 ? 'Cơ sở này chưa có phòng' : '-- Chọn phòng --'}</option>
                        {availableRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">2. Thiết lập Thời gian</p>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Ngày trực</label>
                      <input type="date" required min={format(new Date(), 'yyyy-MM-dd')} value={form.workDate} onChange={e => setForm({ ...form, workDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-primary-500 text-sm font-medium text-slate-700 transition-colors" />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Từ giờ</label>
                        <input type="time" required value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-primary-500 text-sm font-medium text-slate-700 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Đến giờ</label>
                        <input type="time" required value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-primary-500 text-sm font-medium text-slate-700 transition-colors" />
                      </div>
                    </div>
                    
                    {/* CHỈ HIỂN THỊ NẾU LÀ BÁC SĨ */}
                    {selectedStaffRole !== 'RECEPTIONIST' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 mt-4">Thời lượng mỗi ca khám</label>
                        <select value={form.slotDuration} onChange={e => setForm({ ...form, slotDuration: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:border-primary-500 text-sm font-medium text-slate-700 transition-colors">
                          <option value="15">15 phút / bệnh nhân</option>
                          <option value="30">30 phút / bệnh nhân</option>
                          <option value="60">60 phút / bệnh nhân</option>
                        </select>
                      </motion.div>
                    )}
                    
                    <div className={`mt-2 p-3 rounded-lg border text-xs font-medium ${formMinutes > 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                      {formMinutes > 0 ? (
                        <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Tổng thời gian: {formatDuration(formMinutes)} {selectedStaffRole !== 'RECEPTIONIST' && `(khoảng ${formSlots} lượt khám)`}</p>
                      ) : (
                        <p className="flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Lỗi: Giờ kết thúc phải sau giờ bắt đầu</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex justify-end gap-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors">Hủy thao tác</button>
                  <button type="submit" disabled={formMinutes <= 0} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors shadow-sm"><Save className="w-3.5 h-3.5" /> Xác nhận phân công</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}