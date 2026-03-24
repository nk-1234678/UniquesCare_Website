import React, { useState } from 'react'
import About from '../components/About'
import AboutTeam from '../components/AboutTeam'
import Tech from '../components/Tech'

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      background: "#F5F5F5",
      color: "#1A1A1A",
      minHeight: "100vh"
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');

        *{
          box-sizing:border-box;
          margin:0;
          padding:0;
        }

        body{
          font-family:'IBM Plex Sans',sans-serif;
        }

        .btn-red { background: #C0272D; color: #fff; border: 1.5px solid #C0272D; border-radius: 4px; padding: 10px 22px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-red:hover { background: #a81f25; }
        .btn-outline { background: #fff; color: #1A1A1A; border: 1.5px solid #1A1A1A; border-radius: 4px; padding: 10px 22px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-outline:hover { background: #1A1A1A; color: #fff; }

        .wrap{
          max-width:1100px;
          margin:auto;
          padding:0 24px;
          text-align:center;
        }

        section{
          padding:60px 0;
        }

        .box{
          background:#fff;
          border:1.5px solid #E0E0E0;
          border-radius:6px;
        }

        .pill-switcher{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          background:#1A1A1A;
          border-radius:999px;
          padding:5px;
          gap:4px;
          margin:auto;
        }

        .pill-tab{
          display:flex;
          align-items:center;
          gap:7px;
          padding:10px 24px;
          border-radius:999px;
          border:none;
          cursor:pointer;
          font-family:'IBM Plex Sans',sans-serif;
          font-size:13.5px;
          font-weight:600;
          transition:all .25s;
        }

        .pill-tab.active{
          background:#C0272D;
          color:#fff;
        }

        .pill-tab.inactive{
          background:transparent;
          color:#aaa;
        }

        .pill-tab.inactive:hover{
          color:#fff;
        }

        .tab-panel{
          animation:fadeIn .3s ease;
        }

        @keyframes fadeIn{
          from{
            opacity:0;
            transform:translateY(8px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

      `}</style>


      {/* HEADER */}

      <section style={{padding:'70px 0 20px'}}>

        <div className="wrap">

          <p style={{
            fontSize:11,
            fontWeight:600,
            letterSpacing:'0.12em',
            textTransform:'uppercase',
            color:'#C0272D',
            marginBottom:10
          }}>
            UNIQUE CARE / ABOUT
          </p>

          <h1 style={{
            fontSize:46,
            fontWeight:700,
            lineHeight:1.1,
            marginBottom:12
          }}>
            About Us
          </h1>

          <p style={{
            fontSize:15,
            color:'#777',
            lineHeight:1.7,
            maxWidth:550,
            margin:'0 auto 40px'
          }}>
            UNIQUE CARE is on a mission to digitize and streamline diagnostic
            lab operations across India — one lab at a time.
          </p>


          {/* TAB SWITCHER */}

          <div className="pill-switcher">

            <button
              className={`pill-tab ${activeTab === 'about' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('about')}
            >

              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={activeTab === 'about' ? "#fff" : "#888"}>
                <path d="M12 2C12 2 6 8.5 6 13.5a6 6 0 0 0 12 0C18 8.5 12 2 12 2zm0 16a3 3 0 0 1-3-3c0-2.5 3-6 3-6s3 3.5 3 6a3 3 0 0 1-3 3z"/>
              </svg>

              About Us
            </button>


            <button
              className={`pill-tab ${activeTab === 'team' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('team')}
            >

              <svg width="15" height="15" viewBox="0 0 24 24"
                fill="none"
                stroke={activeTab === 'team' ? "#fff" : "#888"}
                strokeWidth="2">

                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              </svg>

              About Team
            </button>

          </div>

        </div>

      </section>


      {/* TAB CONTENT */}

      <div className="tab-panel" key={activeTab}>

        {activeTab === 'about' && (
          <div className="wrap">
            <About />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="wrap">
            <AboutTeam />
            <Tech/>
          </div>
        )}

      </div>


    </div>
  )
}

export default AboutPage