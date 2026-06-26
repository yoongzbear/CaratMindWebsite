'use client';
import ExerciseDetailModal from '@/app/components/modal/ExerciseModal';
import Pill from '@/app/components/Pill';
import {
  buttonGradientColor,
  buttonOutlined,
  buttonRed,
  C,
  styles,
} from '@/app/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function ExerciseCatalogPage() {
  const { user, loading } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [openDetail, setopenDetail] = useState(false);

  // const viewMore = () => {
  //   Swal.fire({
  //     title: 'Exercise 1',
  //     // text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget lectus lectus. Vestibulum id nisi odio. Maecenas nisi lectus, tempor in augue quis, dapibus viverra ligula. Nunc vitae varius velit. Maecenas elementum, arcu quis iaculis sollicitudin, mauris mauris consectetur nulla, sit amet venenatis mi urna quis risus. Aliquam erat volutpat. Nam interdum lorem felis, id malesuada dolor pharetra pharetra. Donec a cursus lorem. Duis quam erat, interdum sit amet nulla vel, lobortis egestas justo. Quisque convallis id felis et laoreet. Cras egestas, arcu a aliquet bibendum, risus diam vestibulum nulla, eu egestas dolor odio eu turpis. Nunc quis dapibus arcu. Mauris pellentesque, quam ut imperdiet cursus, eros dolor consequat ipsum, vitae porta felis nisi at dolor. Ut sollicitudin mauris non neque malesuada facilisis.',
  //     // html:
  //     width: 1000,
  //     didOpen: () => {
  //       const title = Swal.getTitle();
  //       const content = Swal.getHtmlContainer();
  //       if (title) title.style.textAlign = 'left';
  //       if (content) content.style.textAlign = 'justify';
  //     },
  //   });
  // };

  return (
    <section
      className="min-h-[calc(100vh-140px)] px-8 pt-6 pb-12"
      style={{
        background: C.bgPage,
      }}
    >
      <div className="w-[90%] mx-auto">
        <header className="mb-3">
          <h1 style={{ ...styles.header1, margin: '0' }}>
            Coping Exercise Catalogue
          </h1>
        </header>

        <div
          className="rounded-[10px] border mb-3.75 p-2.5"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
            border: '1px solid #eef2f9',
          }}
        >
          <div className="flex w-full gap-5">
            {/* search */}
            <div className="w-50">
              {/* <label style={styles.label}>Start date</label> */}
              <input
                className="w-full"
                style={styles.input}
                type="search"
                placeholder="Search Exercise..."
              ></input>
            </div>

            {/* mood dropdown */}
            <div className="w-40">
              {/* <label style={styles.label}>Period</label> */}
              <select className="w-full" style={styles.dropdown}>
                <option>Select Mood</option>
              </select>
            </div>

            {/* type dropdown */}
            <div className="w-40">
              {/* <label style={styles.label}>Period</label> */}
              <select className="w-full" style={styles.dropdown}>
                <option>Select Type</option>
              </select>
            </div>
          </div>

          {/* exercise card */}
          <div
            className="rounded-[10px] border mb-3.75 p-2.5"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 12px rgba(146,168,209,0.08)',
              border: '1px solid #eef2f9',
            }}
          >
            <h1 style={styles.header1}>Exercise 1</h1>
            <div className="flex gap-3 mb-2">
              {/* mood */}
              <Pill bgColor="#edf9f0" borderColor="#cdebd5" textColor="#2e7d32">
                Happy
              </Pill>
              {/* exercise type */}
              <Pill>Breathing</Pill>
            </div>
            {/* desc - max 3 lines*/}
            <p style={styles.pText}>
              Proin in odio sodales, sagittis tortor a, mollis eros. Vestibulum
              vitae bibendum sapien. In at euismod diam. Vivamus sed tellus sit
              amet nibh condimentum ornare. Nunc non purus lectus. Vestibulum
              nec cursus turpis, in pretium diam. Aenean vitae placerat ni...
            </p>
            {/* steps.forEach((step, index) => {
  console.log(`${index + 1}. ${step}`);
}); */}
            <button
              onClick={() => setopenDetail(true)}
              className={`inline-flex cursor-pointer items-center justify-center gap-1.5 ${buttonGradientColor} text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm`}
            >
              {'View More'}
            </button>

            <ExerciseDetailModal
              open={openDetail}
              onClose={() => setopenDetail(false)}
              name="Exercise 1"
              mood="Happy"
              type="Breathing"
              steps="Proin in odio sodales, sagittis tortor a, mollis eros. Vestibulum
              vitae bibendum sapien. In at euismod diam. Vivamus sed tellus sit
              amet nibh condimentum ornare. Nunc non purus lectus. Vestibulum
              nec cursus turpis, in pretium diam. Aenean vitae placerat ni..."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
