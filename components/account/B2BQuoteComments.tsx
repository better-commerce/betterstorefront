import { B2B_QUOTE_NOTE, EmptyGuid, NEXT_PUT_NOTES } from '@components/utils/constants';
import axios from 'axios';
import { useState } from 'react';
import { useUI } from '@components/ui/context'
const B2BQuoteComments = ({ quoteId }: any) => {
  const { setAlert } = useUI();
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleNoteTextChange = (e: any) => {
    setNoteText(e.target.value);
  };

  // Submit comment to the API
  const handleSubmit = async () => {
    setLoading(true);

    const data = {
      objectId: quoteId,
      noteText,
      recordId: EmptyGuid,
      noteType: 6,
    };

    try {
      const result: any = await axios.put(NEXT_PUT_NOTES, { data });
      if (result.status === 200 || result.status === 201) {
        // If the response is successful
        setAlert({
          type: 'success',
          msg: 'Comment submitted successfully.',
        });
        setNoteText(''); // Clear the textarea
      } else {
        // Handle other non-200 responses
        setAlert({
          type: 'error',
          msg: 'Failed to submit the comment. Please try again.',
        });
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        msg: 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-start w-full mt-4'>
      <label className='text-sm font-semibold text-black'>Notes</label>
      <textarea
        placeholder="Enter note..."
        value={noteText}
        onChange={handleNoteTextChange}
        rows={4}
        cols={50}
        className='text-sm font-medium text-black border border-gray-300 placeholder:text-gray-300 placeholder:font-normal'
      />
      <div className='justify-end flex-1 mt-4'>
        <button onClick={handleSubmit} className='bg-black hover:bg-gray-900 focus:ring-black  ttnc-ButtonPrimary text-sm font-medium py-3 px-4 sm:py-3.5 sm:px-6 nc-Button sm:text-white gap-2 relative h-auto inline-flex items-center justify-center rounded-full transition-colors disabled:bg-opacity-90 dark:bg-slate-100 text-slate-50 dark:text-slate-800 shadow-xl flex-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0' disabled={loading || !noteText}>
          {loading ? 'Submitting...' : 'Submit Note'}
        </button>
      </div>
    </div>
  );
};

export default B2BQuoteComments;
