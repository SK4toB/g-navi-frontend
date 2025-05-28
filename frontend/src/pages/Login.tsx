export default function Login() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <h1 style={{ fontFamily: 'DM Sans', fontWeight: '700', fontSize: '50px', lineHeight: '0.48em', letterSpacing: '-0.8%', textAlign: 'center', color: '#122250', marginBottom: '40px' }}>
                Login
            </h1>
            {/* 사번 입력 필드 */}
            <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
                <label htmlFor="employeeId" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fontSize: '18px', lineHeight: '1.33em', letterSpacing: '-0.8%', color: '#1E293B', display: 'block', marginBottom: '8px' }}>
                    사번
                </label>
                <input
                    type="text"
                    id="employeeId"
                    style={{
                        borderRadius: '100px',
                        padding: '16px 24px', // Increased padding based on Figma layout
                        border: '1px solid #CDCDCD',
                        backgroundColor: 'rgba(255, 255, 255, 0.55)',
                        width: 'calc(100% - 48px)', // Adjust width for padding
                        fontSize: '18px',
                    }}
                />
            </div>
            {/* 비밀번호 입력 필드 */}
            <div style={{ marginBottom: '30px', width: '100%', maxWidth: '400px' }}>
                <label htmlFor="password" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fontSize: '18px', lineHeight: '1.33em', letterSpacing: '-0.8%', color: '#1E293B', display: 'block', marginBottom: '8px' }}>
                    비밀번호
                </label>
                <input
                    type="password"
                    id="password"
                    style={{
                        borderRadius: '100px',
                        padding: '16px 24px', // Increased padding based on Figma layout
                        border: '1px solid #CDCDCD',
                        backgroundColor: 'rgba(255, 255, 255, 0.55)',
                        width: 'calc(100% - 48px)', // Adjust width for padding
                        fontSize: '18px',
                    }}
                />
            </div>
            {/* 로그인 버튼 */}
            <button
                style={{
                    borderRadius: '1234px',
                    backgroundColor: '#122250',
                    color: '#FFFFFF',
                    padding: '18px 40px', // Adjusted padding
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Source Code Pro',
                    fontWeight: '700',
                    fontSize: '18px',
                    lineHeight: '1.11em',
                    letterSpacing: '-0.6%',
                    textAlign: 'center',
                }}
            >
                로그인
            </button>
        </div>
    )
}