'use client';
import EntryDetailModal, {
  DeleteEntryModal,
} from '@/app/components/modal/EntryModal';
import {
  buttonGradientColor,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { Eye } from 'lucide-react';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function MoodInsightPage() {
  const { user, loading } = useAuth();
  const [entry, setEntry] = useState('');
  const [openDetail, setopenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const entryDetail = () => {
    Swal.fire({
      title: 'Date (Last Updated: Date)',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget lectus lectus. Vestibulum id nisi odio. Maecenas nisi lectus, tempor in augue quis, dapibus viverra ligula. Nunc vitae varius velit. Maecenas elementum, arcu quis iaculis sollicitudin, mauris mauris consectetur nulla, sit amet venenatis mi urna quis risus. Aliquam erat volutpat. Nam interdum lorem felis, id malesuada dolor pharetra pharetra. Donec a cursus lorem. Duis quam erat, interdum sit amet nulla vel, lobortis egestas justo. Quisque convallis id felis et laoreet. Cras egestas, arcu a aliquet bibendum, risus diam vestibulum nulla, eu egestas dolor odio eu turpis. Nunc quis dapibus arcu. Mauris pellentesque, quam ut imperdiet cursus, eros dolor consequat ipsum, vitae porta felis nisi at dolor. Ut sollicitudin mauris non neque malesuada facilisis.',
      confirmButtonText: 'Edit Entry',
      // showCancelButton: true,
      showDenyButton: true,
      denyButtonText: 'Delete Entry',
      width: 1000,
      didOpen: () => {
        const title = Swal.getTitle();
        const content = Swal.getHtmlContainer();
        if (title) title.style.textAlign = 'left';
        if (content) content.style.textAlign = 'justify';
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success'); // TODO
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Cannot delete entry',
          text: 'You are not allowed to delete a journal entry after submitted. Do not worry, no one will see your entry!',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  const handleEdit = () => {
    // save as draft - save into db only
  };

  const performExercise = () => {
    // save as draft - save into db only
  };

  const moodDashboard = () => {
    // save as draft - save into db only
  };

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[90%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0' }}>Mood Insights</h1>
        </header>

        {/* journal summary */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3 style={styles.header3}>Date</h3>
          <textarea
            disabled
            className="w-full h-24 px-3 py-2.5 border-none resize-none rounded-lg text-[14px] bg-white box-border outline-none font-inherit"
            value="hello"
            style={{
              border: `1px solid ${C.border}`,
              color: C.navy,
            }}
          ></textarea>

          <div className="flex gap-10 mt-3">
            {/* view more button */}
            <button
              onClick={() => setopenDetail(true)}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'View More'}
            </button>

            <EntryDetailModal
              open={openDetail}
              onClose={() => setopenDetail(false)}
              date="05 April 2026"
              lastUpdated="05 April 2026"
              entry="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget lectus lectus. Vestibulum id nisi odio. Maecenas nisi lectus, tempor in augue quis, dapibus viverra ligula. Nunc vitae varius velit. Maecenas elementum, arcu quis iaculis sollicitudin, mauris mauris consectetur nulla, sit amet venenatis mi urna quis risus. Aliquam erat volutpat. Nam interdum lorem felis, id malesuada dolor pharetra pharetra. Donec a cursus lorem. Duis quam erat, interdum sit amet nulla vel, lobortis egestas justo. Quisque convallis id felis et laoreet. Cras egestas, arcu a aliquet bibendum, risus diam vestibulum nulla, eu egestas dolor odio eu turpis. Nunc quis dapibus arcu. Mauris pellentesque, quam ut imperdiet cursus, eros dolor consequat ipsum, vitae porta felis nisi at dolor. Ut sollicitudin mauris non neque malesuada facilisis."
            />

            {/* edit entry button */}
            <button
              onClick={handleEdit}
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'Edit Entry'}
            </button>

            {/* delete button */}
            <button
              className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonRed} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
              // onClick={() =>
              //   Swal.fire({
              //     title: 'Cannot delete entry',
              //     text: 'You are not allowed to delete a journal entry after submitted. Do not worry, no one will see your entry!',
              //     icon: 'warning',
              //     confirmButtonText: 'OK',
              //   })
              // }
              onClick={() => setOpenDelete(true)}
            >
              {'Delete Entry'}
            </button>

            <DeleteEntryModal
              open={openDelete}
              onClose={() => setOpenDelete(false)}
            />
          </div>
        </div>

        {/* mood insight */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <p style={styles.pText}>From your entry, you felt:</p>
          <div className="flex flex-col items-center">
            {/* mood icon */}
            <div
              className={`relative mb-2 z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300`}
            >
              <Eye size={16} />
            </div>
            <p style={styles.pText}>Happy</p>
          </div>

          <div
            className="rounded-[10px] border mb-3.75 p-2.5"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              border: '1px solid #eef2f9',
            }}
          >
            <p style={styles.pText}>
              <b>Your happy mood was because of </b>nec ipsum blandit, sed
              ullamcorper sapien accumsan. Aliquam eget augue fringilla,
              porttitor purus nec, venenatis ex. Donec ut tortor lectus.
              Pellentesque sed malesuada turpis. Donec semper aliquet ipsum eu
              auctor. Duis ut diam nisl. Maecenas suscipit tempor nibh vel
              egestas.
            </p>
          </div>
        </div>

        {/* coping exercise recommendation */}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <h3 style={{ ...styles.header3, fontWeight: 500 }}>
            Recommended Coping Exercise:
          </h3>
          <div className="flex flex-col items-center">
            {/* recommended exercise */}
            <h3 style={styles.header3}>Happy</h3>
          </div>

          <p style={styles.pText}>
            <b>Your happy mood was because of </b>nec ipsum blandit, sed
            ullamcorper sapien accumsan. Aliquam eget augue fringilla, porttitor
            purus nec, venenatis ex. Donec ut tortor lectus. Pellentesque sed
            malesuada turpis. Donec semper aliquet ipsum eu auctor. Duis ut diam
            nisl. Maecenas suscipit tempor nibh vel egestas.
          </p>
          {/* perform exercise button */}
          <button
            onClick={performExercise}
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            {'Perform Exercise'}
          </button>
        </div>

        {/* mood chart*/}
        <div
          className="rounded-[10px] border mb-3.75 p-2.5 flex flex-col items-center"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          {/* mood chart here */}
          {/* mood dashboard button */}
          <button
            onClick={moodDashboard}
            className={`mt-1 inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
          >
            {'View Mood Dashboard'}
          </button>
        </div>
      </div>
    </section>
  );
}
