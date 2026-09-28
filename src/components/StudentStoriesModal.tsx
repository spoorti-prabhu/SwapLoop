import React from 'react';
import { X, Heart, Quote, Repeat } from 'lucide-react';

interface StudentStoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Story {
  id: string;
  studentName: string;
  major: string;
  avatarBg: string;
  dorm: string;
  givenItem: string;
  receivedItem: string;
  loopSize: string;
  quote: string;
  savings: string;
}

const STORIES: Story[] = [
  {
    id: 's1',
    studentName: 'Priya Mukherjee',
    major: 'Computer Science, 2nd Year',
    dorm: 'Bhabha Hall (North Campus)',
    avatarBg: 'bg-rose-500',
    givenItem: 'Wireless Noise-Canceling Headphones',
    receivedItem: 'Dorm Room Mini-Fridge',
    loopSize: '4-Way Loop',
    quote:
      'I was moving into a single room and desperately needed a mini-fridge, but had no cash to spare. Listed my spare headphones that were sitting in a drawer. The 5:00 PM drop matched me in a 4-student cycle! We all dropped our items off at the Student Union desk with secret QR codes. Zero awkward negotiating.',
    savings: '$180 Saved'
  },
  {
    id: 's2',
    studentName: 'Arjun Sharma',
    major: 'Mechanical Engineering, 3rd Year',
    dorm: 'Hostel 3 (Engineering Quad)',
    avatarBg: 'bg-blue-600',
    givenItem: 'Engineering Drafter & T-Scale',
    receivedItem: 'Single-Speed Campus Commuter Bicycle',
    loopSize: '3-Way Loop (Scenario A)',
    quote:
      'Finished my first-year engineering drawing courses and had a heavy drafter I had no use for. Bhavya had a bike she was outgrowing, and Chetan had an extension power dock. The algorithm tied the knot in one loop. I rode the bike to lectures that very evening!',
    savings: '$120 Saved'
  },
  {
    id: 's3',
    studentName: 'Devon Ramirez',
    major: 'Architecture & Design, Senior',
    dorm: 'Downtown Lofts',
    avatarBg: 'bg-purple-600',
    givenItem: 'Set of 12 Architecture Modeling Tools',
    receivedItem: 'Ergonomic Desk Chair',
    loopSize: '5-Way Cycle',
    quote:
      'Normal student resale groups are full of lowballers and ghosting. SwapLoop’s strict blind proposals removed all bias. You only judge the exchange on the fairness of the item value band. Cleanest trade experience I’ve had in college.',
    savings: '$240 Saved'
  },
  {
    id: 's4',
    studentName: 'Aaliyah Khan',
    major: 'Biochemistry, 1st Year',
    dorm: 'Kasturba Residence',
    avatarBg: 'bg-emerald-600',
    givenItem: 'Organic Chemistry Model Kit',
    receivedItem: 'Graphing Calculator (TI-84)',
    loopSize: 'Pay-it-Forward Gift Chain',
    quote:
      'A graduating senior left a study lamp as a free community gift, which triggered a pay-it-forward chain where four of us were able to trade up without putting in cash. The fact that everything stays on campus and avoids landfills is incredible.',
    savings: '$95 Saved'
  }
];

export const StudentStoriesModal: React.FC<StudentStoriesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] border border-pink-200/90 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-pink-100 pb-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-[#db2777] uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-[#db2777]" />
              <span>Real Campus Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Stories from the Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              How university students are saving hundreds of dollars every semester, eliminating dorm waste, and swapping securely through physical campus escrow.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close stories modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stories List */}
        <div className="space-y-6">
          {STORIES.map((story) => (
            <div
              key={story.id}
              className="p-6 rounded-3xl bg-gradient-to-br from-[#FFF7FA] via-white to-pink-50/30 border border-pink-200/80 shadow-xs space-y-4 hover:border-pink-300 hover:shadow-md transition-all"
            >
              {/* Top row: Student badge + Loop Type */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${story.avatarBg} text-white font-black text-base flex items-center justify-center shadow-xs flex-shrink-0`}
                  >
                    {story.studentName[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{story.studentName}</h3>
                    <div className="text-xs text-slate-500 font-medium">
                      {story.major} • <span className="text-pink-600 font-semibold">{story.dorm}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-pink-100/90 text-[#be185d] font-bold text-[11px] border border-pink-200 flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    <span>{story.loopSize}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-200">
                    {story.savings}
                  </span>
                </div>
              </div>

              {/* Given ➔ Received Pill */}
              <div className="p-3 rounded-2xl bg-white border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600">Gave:</span>
                  <span className="font-bold">{story.givenItem}</span>
                </div>

                <div className="hidden sm:block text-pink-300">➔</div>

                <div className="flex items-center gap-1.5 text-emerald-800">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Received:</span>
                  <span className="font-bold">{story.receivedItem}</span>
                </div>
              </div>

              {/* Quote */}
              <div className="relative pl-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic">
                <Quote className="w-4 h-4 text-pink-400 absolute left-0 top-0 rotate-180" />
                "{story.quote}"
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Ready to make your mark?</div>
            <div className="text-sm font-semibold text-slate-200">
              List one item today and become part of tomorrow's 5:00 PM drop.
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#db2777] to-[#be185d] text-white font-bold text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer whitespace-nowrap"
          >
            Join the Next Loop →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentStoriesModal;
