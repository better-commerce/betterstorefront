import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { dateFormat } from '@framework/utils/parse-util';

type AssessmentNote = {
  noteId: string;
  stageId: number;
  stage: string;
  notes: string;
  createdBy: string;
  createdOn: string;
};

type QuoteAssessmentNotesProps = {
  notes: AssessmentNote[];
};

const QuoteAssessmentNotes: React.FC<QuoteAssessmentNotesProps> = ({ notes }) => {
  const groupedNotes = useMemo(() => {
    return notes?.reduce<Record<string, AssessmentNote[]>>((acc, note) => {
      if (!acc[note.stage]) acc[note.stage] = [];
      acc[note.stage].push(note);
      return acc;
    }, {});
  }, [notes])

  return (
    <div>
      {Object.entries(groupedNotes).map(([stage, stageNotes]) => (
        <Disclosure key={stage} as="div" className="border rounded shadow-sm bg-white">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between items-center px-3 py-2 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none">
              <span>{stage}</span>
              <ChevronUpIcon className={`h-4 w-4 transform transition-transform ${open ? '' : 'rotate-180'}`}/>
            </Disclosure.Button>
            <Disclosure.Panel className="px-3 py-2">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200 text-xs">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border px-2 py-1 text-left w-3/4">Note</th>
                      <th className="border px-2 py-1 text-left">Created By</th>
                      <th className="border px-2 py-1 text-left">Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageNotes.map((note) => (
                      <tr key={note.noteId} className="align-top">
                        <td className="border px-2 py-1 whitespace-pre-line text-gray-800">{note.notes}</td>
                        <td className="border px-2 py-1 whitespace-pre-line text-gray-800">{note.createdBy}</td>
                        <td className="border px-2 py-1 text-gray-600 text-right">{dateFormat(note.createdOn, 'DD/MM/YYYY')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      ))}
    </div>
  );
};

export default QuoteAssessmentNotes;