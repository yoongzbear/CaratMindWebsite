// 'use client';

// import { C } from '@/app/styles/styles';

// export function SocialAuthButtons({ nextPath }: { nextPath?: string | null }) {
//   const nextQuery = nextPath ? `&next=${encodeURIComponent(nextPath)}` : '';

//   return (
//     <div className="mt-4.5">
//       <p
//         className="mb-3 text-center text-[12px]"
//         style={{
//           color: C.faint,
//         }}
//       >
//         Or continue with
//       </p>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//         <a
//           href={`/api/auth/oauth?provider=Google${nextQuery}`}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: '11px 14px',
//             borderRadius: '10px',
//             border: `1px solid ${C.border}`,
//             background: 'white',
//             color: C.navy,
//             fontSize: '13px',
//             fontWeight: 600,
//             textDecoration: 'none',
//             fontFamily: 'inherit',
//           }}
//         >
//           Google
//         </a>
//       </div>
//     </div>
//   );
// }
