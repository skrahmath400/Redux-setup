// import React, { useEffect, useState } from "react";
// import {jwtDecode} from "jwt-decode";

// function TokenCode() {  // ← Capital T and C
//   const [authData, setAuthData] = useState(null);

//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqb2huZG9lX2FkbWluIiwicm9sZSI6IkFkbWluaXN0cmF0b3IiLCJjYXRlZ29yeSI6IlNjaG9vbCIsImNhbXB1c05hbWUiOiJOb3J0aCBXaW5nIENhbXB1cyIsInNjcmVlblBlcm1pc3Npb25zIjpbeyJzY3JlZW5JZCI6IlNDUl8wMDEiLCJ1cmwiOiIvZGFzaGJvYXJkIiwiYWNjZXNzIjoiYWxsIn0seyJzY3JlZW5JZCI6IlNDUl8wMDIiLCJ1cmwiOiIvc3R1ZGVudC1saXN0IiwiYWNjZXNzIjoidmlldyJ9LHsic2NyZWVuSWQiOiJTQ1JfMDAzIiwidXJsIjoiL2ZlZXMtbWFuYWdlbWVudCIsImFjY2VzcyI6InVwZGF0ZSJ9LHsic2NyZWVuSWQiOiJTQ1JfMDA0IiwidXJsIjoiL2FkbWlzc2lvbnMiLCJhY2Nlc3MiOiJjcmVhdGUifV0sImlhdCI6MTcxNTYzNTIwMH0.XvR8Zf6Wz4Y-m3vKz-Yv2lG_M5V-O_pQ7n4U-W_8m8o";

//   useEffect(() => {
//     try {
//       const decoded = jwtDecode(token);
//       setAuthData(decoded);
//       console.log(decoded);
//     } catch (err) {
//       console.error("Invalid token");
//     }
//   }, []);

//   return (
//     <div>
//       <h2>Token Test Component</h2>
//       {authData ? (
//         <pre>{JSON.stringify(authData, null, 2)}</pre>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default TokenCode;  // ← Export with capital