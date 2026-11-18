/**
 * Credang AI — Interview Integrity & Evaluation Platform
 * Frontend-only interactive prototype (React, single file).
 *
 * Based on "Interview Integrity & Evaluation Platform — Architecture Design V1.0".
 * Core modules preserved: (A) Interview Integrity / cheating detection engine,
 * (B) AI-assisted Evaluation tool, plus interview room, question bank, scorecards and settings.
 *
 * IMPORTANT: All data is mock data held in React state. No backend, APIs, database,
 * real AI or real monitoring is implemented — integrity signals are SIMULATED for demonstration.
 */
import React, { useState, useEffect, useMemo, useRef } from "react";

/* ============================================================================
   STYLES
   ========================================================================== */
const CSS = `
.ch-root{--navy-950:#070F2B;--navy-900:#0B1638;--navy-800:#122052;--navy-700:#1B2C6B;--navy-600:#2A3D86;
--purple:#6C5CE7;--purple-600:#5B4BD8;--purple-50:#F1EFFE;--purple-100:#E4E0FD;
--bg:#F4F6FB;--surface:#FFFFFF;--surface-2:#F8F9FD;--border:#E3E7F1;--border-2:#EDF0F7;
--text:#0E1733;--text-2:#3B4566;--muted:#6B7493;--faint:#9AA2BC;
--green:#0F9D74;--green-50:#E7F7F1;--amber:#D98A06;--amber-50:#FDF4E3;--red:#DC3D4B;--red-50:#FDECEE;
--blue:#3366F0;--blue-50:#EAF0FE;--teal:#0A9DB0;--pink:#C53D9C;
--radius:14px;--radius-sm:10px;--shadow-sm:0 1px 2px rgba(14,23,51,.05),0 1px 3px rgba(14,23,51,.04);
--shadow:0 4px 18px rgba(14,23,51,.07);--shadow-lg:0 24px 60px rgba(7,15,43,.22);
font-family:Inter,"Segoe UI",Roboto,system-ui,-apple-system,sans-serif;color:var(--text);background:var(--bg);
font-size:14px;line-height:1.5;min-height:100vh;-webkit-font-smoothing:antialiased}
.ch-root *{box-sizing:border-box}
.ch-root button{font-family:inherit}
.ch-root input,.ch-root select,.ch-root textarea{font-family:inherit;font-size:14px;color:var(--text)}
.ch-layout{display:flex;min-height:100vh}

/* sidebar */
.ch-sidebar{width:252px;flex-shrink:0;background:linear-gradient(180deg,var(--navy-900) 0%,var(--navy-950) 100%);color:#C9D0EA;
display:flex;flex-direction:column;position:sticky;top:0;height:100vh;z-index:40;transition:transform .25s ease}
.ch-brand{display:flex;align-items:center;gap:11px;padding:22px 20px 18px}
.ch-logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7B6CF6,#3D58E8);display:grid;place-items:center;color:#fff;
box-shadow:0 6px 18px rgba(108,92,231,.45)}
.ch-brand-name{font-weight:700;color:#fff;font-size:16.5px;letter-spacing:-.2px}
.ch-brand-sub{font-size:11px;color:#8E98C2;margin-top:-2px}
.ch-nav{padding:6px 12px;flex:1;overflow-y:auto}
.ch-nav-label{font-size:10.5px;text-transform:uppercase;letter-spacing:1.1px;color:#6873A3;padding:14px 10px 6px;font-weight:600}
.ch-nav-item{display:flex;align-items:center;gap:11px;width:100%;padding:9.5px 12px;border:none;background:none;color:#B9C1E0;border-radius:10px;
cursor:pointer;font-size:13.5px;font-weight:500;text-align:left;transition:all .15s ease;position:relative}
.ch-nav-item:hover{background:rgba(255,255,255,.06);color:#fff}
.ch-nav-item.active{background:linear-gradient(90deg,rgba(108,92,231,.32),rgba(108,92,231,.08));color:#fff}
.ch-nav-item.active::before{content:"";position:absolute;left:-12px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:#8B7DFA}
.ch-nav-badge{margin-left:auto;font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:20px;background:rgba(220,61,75,.9);color:#fff}
.ch-nav-badge.live{background:#DC3D4B;animation:ch-pulse 1.6s infinite}
.ch-side-foot{padding:14px;border-top:1px solid rgba(255,255,255,.07)}
.ch-guard{background:rgba(108,92,231,.14);border:1px solid rgba(139,125,250,.25);border-radius:12px;padding:12px;font-size:12px;color:#C9D0EA}
.ch-guard b{color:#fff;display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:12.5px}

/* main */
.ch-main{flex:1;min-width:0;display:flex;flex-direction:column}
.ch-topbar{height:66px;background:rgba(255,255,255,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);display:flex;align-items:center;
gap:14px;padding:0 28px;position:sticky;top:0;z-index:30}
.ch-icon-btn.ch-menu-btn{display:none}
.ch-search{flex:1;max-width:420px;position:relative}
.ch-search input{width:100%;height:40px;border:1px solid var(--border);background:var(--surface-2);border-radius:11px;padding:0 14px 0 38px;outline:none;transition:all .15s}
.ch-search input:focus{border-color:var(--purple);background:#fff;box-shadow:0 0 0 4px var(--purple-50)}
.ch-search .ic{position:absolute;left:12px;top:11px;color:var(--faint)}
.ch-top-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.ch-proto-pill{font-size:11.5px;font-weight:600;color:var(--purple-600);background:var(--purple-50);border:1px solid var(--purple-100);padding:5px 10px;border-radius:20px;white-space:nowrap}
.ch-live-pill{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:var(--red);background:var(--red-50);border:1px solid #F7C9CE;padding:5px 11px;border-radius:20px;cursor:pointer;white-space:nowrap}
.ch-icon-btn{width:40px;height:40px;border-radius:11px;border:1px solid var(--border);background:#fff;display:grid;place-items:center;cursor:pointer;color:var(--text-2);position:relative;transition:all .15s}
.ch-icon-btn:hover{border-color:var(--purple-100);color:var(--purple);background:var(--purple-50)}
.ch-dot{position:absolute;top:8px;right:9px;width:8px;height:8px;border-radius:50%;background:var(--red);border:2px solid #fff}
.ch-user{display:flex;align-items:center;gap:10px;padding:4px 6px 4px 4px;border-radius:12px;cursor:pointer;border:1px solid transparent}
.ch-user:hover{border-color:var(--border);background:#fff}
.ch-user-name{font-size:13px;font-weight:600;line-height:1.2}
.ch-user-role{font-size:11.5px;color:var(--muted)}
.ch-dropdown{position:absolute;top:50px;right:0;width:340px;background:#fff;border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow-lg);z-index:60;overflow:hidden;animation:ch-pop .16s ease}
.ch-dd-head{padding:14px 16px;border-bottom:1px solid var(--border-2);display:flex;justify-content:space-between;align-items:center;font-weight:600}
.ch-dd-item{padding:12px 16px;display:flex;gap:11px;border-bottom:1px solid var(--border-2);cursor:pointer;font-size:13px}
.ch-dd-item:hover{background:var(--surface-2)}
.ch-content{padding:26px 28px 40px;max-width:1480px;width:100%;margin:0 auto;animation:ch-fade .25s ease}
.ch-page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:22px;flex-wrap:wrap}
.ch-page-title{font-size:24px;font-weight:700;letter-spacing:-.5px;margin:0}
.ch-page-sub{color:var(--muted);margin-top:3px;font-size:13.5px}
.ch-crumb{font-size:12px;color:var(--faint);font-weight:500;margin-bottom:4px;text-transform:uppercase;letter-spacing:.8px}

/* cards & grid */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-sm)}
.card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border-2)}
.card-title{font-weight:650;font-size:15px;display:flex;align-items:center;gap:8px}
.card-sub{font-size:12.5px;color:var(--muted);margin-top:1px}
.card-body{padding:18px 20px}
.grid{display:grid;gap:18px}
.g-2{grid-template-columns:repeat(2,minmax(0,1fr))}.g-3{grid-template-columns:repeat(3,minmax(0,1fr))}.g-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.g-5{grid-template-columns:repeat(5,minmax(0,1fr))}.g-6{grid-template-columns:repeat(6,minmax(0,1fr))}
.g-main{grid-template-columns:minmax(0,1.75fr) minmax(0,1fr)}
.g-side{grid-template-columns:340px minmax(0,1fr)}
.row{display:flex;align-items:center;gap:10px}.wrap{flex-wrap:wrap}.between{justify-content:space-between}.col{display:flex;flex-direction:column}
.mt-8{margin-top:8px}.mt-12{margin-top:12px}.mt-16{margin-top:16px}.mt-20{margin-top:20px}.mb-12{margin-bottom:12px}.mb-16{margin-bottom:16px}
.muted{color:var(--muted)}.faint{color:var(--faint)}.small{font-size:12.5px}.xs{font-size:11.5px}.bold{font-weight:650}.mono{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-size:12.5px}
.ellipsis{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* stat cards */
.stat{padding:18px;cursor:pointer;transition:all .2s ease;position:relative;overflow:hidden}
.stat:hover{transform:translateY(-3px);box-shadow:var(--shadow);border-color:var(--purple-100)}
.stat-icon{width:40px;height:40px;border-radius:11px;display:grid;place-items:center}
.stat-val{font-size:28px;font-weight:700;letter-spacing:-.8px;margin-top:14px;line-height:1.1}
.stat-label{color:var(--muted);font-size:12.5px;font-weight:500;margin-top:3px}
.stat-foot{font-size:11.5px;margin-top:10px;display:flex;align-items:center;gap:4px;color:var(--muted)}
.stat-go{position:absolute;right:14px;top:18px;color:var(--faint);opacity:0;transition:all .2s}
.stat:hover .stat-go{opacity:1;color:var(--purple)}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:38px;padding:0 15px;border-radius:10px;border:1px solid transparent;font-weight:600;
font-size:13.5px;cursor:pointer;transition:all .15s ease;white-space:nowrap}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:linear-gradient(135deg,var(--purple),var(--purple-600));color:#fff;box-shadow:0 4px 12px rgba(108,92,231,.3)}
.btn-primary:hover:not(:disabled){box-shadow:0 6px 18px rgba(108,92,231,.42);transform:translateY(-1px)}
.btn-navy{background:var(--navy-800);color:#fff}.btn-navy:hover:not(:disabled){background:var(--navy-700)}
.btn-secondary{background:#fff;color:var(--text);border-color:var(--border)}.btn-secondary:hover:not(:disabled){border-color:#C9CFE2;background:var(--surface-2)}
.btn-ghost{background:transparent;color:var(--text-2)}.btn-ghost:hover:not(:disabled){background:var(--surface-2)}
.btn-danger{background:var(--red);color:#fff}.btn-danger:hover:not(:disabled){background:#C42F3C}
.btn-soft-danger{background:var(--red-50);color:var(--red)}.btn-soft-danger:hover:not(:disabled){background:#FAD9DD}
.btn-success{background:var(--green);color:#fff}.btn-success:hover:not(:disabled){background:#0B8762}
.btn-sm{height:32px;padding:0 11px;font-size:12.5px;border-radius:8px}
.btn-lg{height:44px;padding:0 20px;font-size:14.5px}
.icon-act{width:32px;height:32px;border-radius:8px;border:none;background:transparent;color:var(--muted);display:inline-grid;place-items:center;cursor:pointer;transition:all .15s}
.icon-act:hover{background:var(--purple-50);color:var(--purple)}
.icon-act.danger:hover{background:var(--red-50);color:var(--red)}
.icon-act:disabled{opacity:.35;cursor:not-allowed;background:transparent;color:var(--muted)}

/* badges */
.badge{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap;line-height:1.4}
.b-gray{background:#EEF0F6;color:#545E7E}.b-blue{background:var(--blue-50);color:var(--blue)}.b-purple{background:var(--purple-50);color:var(--purple-600)}
.b-green{background:var(--green-50);color:var(--green)}.b-amber{background:var(--amber-50);color:var(--amber)}.b-red{background:var(--red-50);color:var(--red)}
.b-navy{background:var(--navy-800);color:#fff}
.bdot{width:6px;height:6px;border-radius:50%;background:currentColor}
.bdot.pulse{animation:ch-pulse 1.4s infinite}
.chip{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;border:1px solid var(--border);background:#fff;font-size:12.5px;font-weight:550;
cursor:pointer;color:var(--text-2);transition:all .15s}
.chip:hover{border-color:var(--purple-100)}
.chip.active{background:var(--navy-800);border-color:var(--navy-800);color:#fff}
.chip .cnt{font-size:11px;background:rgba(0,0,0,.06);padding:0 6px;border-radius:10px}
.chip.active .cnt{background:rgba(255,255,255,.18)}
.tag{display:inline-block;font-size:11.5px;padding:2px 8px;border-radius:6px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-2);margin:2px 4px 2px 0}

/* table */
.tbl-wrap{overflow-x:auto}
table.tbl{width:100%;border-collapse:collapse;font-size:13.2px}
.tbl th{text-align:left;font-size:11.5px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;padding:11px 16px;background:var(--surface-2);border-bottom:1px solid var(--border);white-space:nowrap}
.tbl td{padding:12px 16px;border-bottom:1px solid var(--border-2);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tbody tr{transition:background .12s}
.tbl tbody tr:hover{background:#FAFBFE}
.tbl tr.click{cursor:pointer}
.person{display:flex;align-items:center;gap:10px;min-width:0}
.person-name{font-weight:600;font-size:13.3px}
.person-sub{font-size:12px;color:var(--muted)}
.avatar{border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:650;flex-shrink:0;letter-spacing:.3px}

/* form */
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.field label{font-size:12.5px;font-weight:600;color:var(--text-2)}
.field .hint{font-size:11.5px;color:var(--faint)}
.field .err{font-size:11.5px;color:var(--red);font-weight:500}
.inp{height:40px;border:1px solid var(--border);border-radius:10px;padding:0 12px;background:#fff;outline:none;transition:all .15s;width:100%}
textarea.inp{height:auto;padding:10px 12px;resize:vertical;min-height:84px;line-height:1.5}
.inp:focus{border-color:var(--purple);box-shadow:0 0 0 4px var(--purple-50)}
.inp.invalid{border-color:var(--red)}
select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7493' stroke-width='2.4'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer}
.inp-sm{height:34px;font-size:13px;border-radius:8px}
.searchbox{position:relative;min-width:220px;flex:1;max-width:340px}
.searchbox input{padding-left:36px}
.searchbox .ic{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--faint)}
.toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--border-2)}
.toggle{width:40px;height:23px;border-radius:20px;background:#D5DAE8;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0;border:none;padding:0}
.toggle::after{content:"";position:absolute;width:17px;height:17px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.toggle.on{background:var(--purple)}.toggle.on::after{transform:translateX(17px)}
.toggle:disabled{opacity:.6;cursor:not-allowed}
.set-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--border-2)}
.set-row:last-child{border-bottom:none}
.set-title{font-weight:600;font-size:13.5px}
.set-desc{font-size:12.5px;color:var(--muted);margin-top:2px}
input[type=range].range{width:100%;accent-color:var(--purple)}
.checkline{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px;cursor:pointer;font-size:13px}
.checkline input{margin-top:3px;accent-color:var(--purple);width:16px;height:16px}

/* tabs */
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--border);margin-bottom:18px;overflow-x:auto}
.tab{padding:10px 14px;border:none;background:none;font-weight:600;font-size:13.5px;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;display:flex;align-items:center;gap:7px}
.tab:hover{color:var(--text)}
.tab.active{color:var(--purple-600);border-bottom-color:var(--purple)}
.seg{display:inline-flex;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:3px}
.seg button{border:none;background:none;padding:6px 12px;border-radius:7px;font-size:12.5px;font-weight:600;color:var(--muted);cursor:pointer}
.seg button.active{background:#fff;color:var(--text);box-shadow:var(--shadow-sm)}

/* modal */
.modal-ov{position:fixed;inset:0;background:rgba(7,15,43,.48);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:ch-fade .15s ease}
.modal{background:#fff;border-radius:18px;box-shadow:var(--shadow-lg);width:100%;max-height:calc(100vh - 40px);display:flex;flex-direction:column;animation:ch-pop .2s ease}
.modal-head{padding:20px 24px 14px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start;border-bottom:1px solid var(--border-2)}
.modal-title{font-size:17px;font-weight:700;letter-spacing:-.2px}
.modal-body{padding:20px 24px;overflow-y:auto}
.modal-foot{padding:14px 24px;border-top:1px solid var(--border-2);display:flex;justify-content:flex-end;gap:10px;background:var(--surface-2);border-radius:0 0 18px 18px}

/* toast */
.toasts{position:fixed;bottom:22px;right:22px;z-index:200;display:flex;flex-direction:column;gap:10px}
.toast{min-width:280px;max-width:380px;background:var(--navy-900);color:#fff;border-radius:12px;padding:12px 14px;display:flex;gap:10px;align-items:flex-start;box-shadow:var(--shadow-lg);
animation:ch-slide .25s ease;font-size:13px}
.toast .ti{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;flex-shrink:0}

/* misc */
.banner{display:flex;gap:12px;align-items:flex-start;padding:12px 16px;border-radius:12px;font-size:13px;border:1px solid}
.banner.info{background:var(--purple-50);border-color:var(--purple-100);color:#3F348F}
.banner.warn{background:var(--amber-50);border-color:#F4DDB0;color:#7A4E04}
.banner.danger{background:var(--red-50);border-color:#F7C9CE;color:#8F1F2A}
.banner.ok{background:var(--green-50);border-color:#BFE7D8;color:#0A6B4F}
.empty{text-align:center;padding:44px 20px;color:var(--muted)}
.empty .ei{width:56px;height:56px;border-radius:16px;background:var(--purple-50);color:var(--purple);display:grid;place-items:center;margin:0 auto 12px}
.empty h4{margin:0 0 4px;color:var(--text);font-size:15px}
.bar{height:8px;border-radius:10px;background:#EDF0F7;overflow:hidden}
.bar>div{height:100%;border-radius:10px;transition:width .5s ease}
.list-item{display:flex;gap:12px;align-items:flex-start;padding:13px 20px;border-bottom:1px solid var(--border-2);cursor:pointer;transition:background .12s}
.list-item:hover{background:#FAFBFE}
.list-item:last-child{border-bottom:none}
.fam-ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex-shrink:0}
.kv{display:grid;grid-template-columns:130px 1fr;gap:8px 12px;font-size:13px}
.kv dt{color:var(--muted)}.kv dd{margin:0;font-weight:550}
.section-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin:0 0 10px}
.divider{height:1px;background:var(--border-2);margin:16px 0}
.quote{border-left:3px solid var(--purple);background:var(--purple-50);padding:10px 14px;border-radius:0 10px 10px 0;font-size:13px;color:#2E2670;font-style:italic}
.answer{background:var(--surface-2);border:1px solid var(--border-2);padding:12px 14px;border-radius:10px;font-size:13px;color:var(--text-2)}
mark{background:#FFE9A8;padding:0 2px;border-radius:3px}
.dots{display:inline-flex;gap:3px}
.dots i{width:9px;height:9px;border-radius:3px;background:#E1E5F0;display:block}
.dots i.on{background:var(--purple)}
.score-pill{min-width:36px;height:26px;border-radius:8px;display:inline-grid;place-items:center;font-weight:700;font-size:13px;padding:0 8px}
.mon-ind{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;padding:5px 11px;border-radius:20px;background:rgba(220,61,75,.12);color:var(--red);border:1px solid rgba(220,61,75,.25)}
.rec-dot{width:8px;height:8px;border-radius:50%;background:var(--red);animation:ch-pulse 1.4s infinite}

/* chart */
.chart-wrap{position:relative}
.chart-tip{position:absolute;pointer-events:none;background:var(--navy-900);color:#fff;font-size:12px;padding:8px 10px;border-radius:9px;box-shadow:var(--shadow);transform:translate(-50%,-110%);white-space:nowrap;z-index:5}
.legend{display:flex;gap:16px;font-size:12px;color:var(--muted);flex-wrap:wrap}
.legend span{display:flex;align-items:center;gap:6px}
.legend i{width:10px;height:10px;border-radius:3px;display:block}

/* interview room */
.room-grid{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(0,1fr);gap:18px}
.stage{position:relative;border-radius:18px;overflow:hidden;aspect-ratio:16/9;background:#0A1230}
.vid{position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(ellipse at 30% 20%,#2A3D86 0%,#0F1B48 55%,#070F2B 100%)}
.vid.anim{background:linear-gradient(120deg,#1B2C6B,#3A2F87,#14245E,#2A3D86);background-size:300% 300%;animation:ch-grad 12s ease infinite}
.vid-off{background:#0B1435}
.vid-label{position:absolute;left:14px;bottom:14px;display:flex;align-items:center;gap:8px;background:rgba(7,15,43,.62);backdrop-filter:blur(6px);color:#fff;padding:6px 11px;border-radius:10px;font-size:12.5px;font-weight:600}
.vid-top{position:absolute;left:14px;right:14px;top:14px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.vid-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(7,15,43,.62);backdrop-filter:blur(6px);color:#fff;padding:5px 10px;border-radius:9px;font-size:11.5px;font-weight:600}
.face-box{position:absolute;border:2px dashed rgba(46,214,163,.85);border-radius:14px;width:24%;height:46%;left:38%;top:20%;transition:border-color .3s}
.face-box span{position:absolute;top:-22px;left:-2px;font-size:10.5px;background:rgba(46,214,163,.9);color:#05261C;padding:1px 6px;border-radius:5px;font-weight:700;white-space:nowrap}
.face-box.alert{border-color:rgba(255,92,108,.95)}.face-box.alert span{background:rgba(255,92,108,.95);color:#fff}
.pip{position:absolute;right:14px;bottom:14px;width:24%;aspect-ratio:16/10;border-radius:12px;overflow:hidden;border:2px solid rgba(255,255,255,.25);box-shadow:0 10px 30px rgba(0,0,0,.35)}
.big-av{width:96px;height:96px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:32px;font-weight:700;box-shadow:0 0 0 8px rgba(255,255,255,.06)}
.ctrl-bar{display:flex;justify-content:center;align-items:center;gap:10px;padding:12px;flex-wrap:wrap}
.ctrl{width:46px;height:46px;border-radius:50%;border:1px solid var(--border);background:#fff;display:grid;place-items:center;cursor:pointer;color:var(--text-2);transition:all .15s}
.ctrl:hover{border-color:var(--purple);color:var(--purple)}
.ctrl.off{background:var(--red);border-color:var(--red);color:#fff}
.timer{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-size:22px;font-weight:700;letter-spacing:1px}
.lobby{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#fff;text-align:center;background:rgba(7,15,43,.55);backdrop-filter:blur(2px)}
.q-nav-pills{display:flex;gap:6px;flex-wrap:wrap}
.q-pill{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:#fff;font-weight:650;font-size:12.5px;cursor:pointer;color:var(--text-2)}
.q-pill.active{background:var(--navy-800);color:#fff;border-color:var(--navy-800)}
.q-pill.done{background:var(--green-50);border-color:#BFE7D8;color:var(--green)}
.feed-item{display:flex;gap:10px;padding:10px 0;border-bottom:1px dashed var(--border);animation:ch-slide .3s ease}
.feed-item:last-child{border-bottom:none}

/* integrity */
.fam-card{padding:16px;cursor:pointer;transition:all .18s}
.fam-card:hover{box-shadow:var(--shadow);transform:translateY(-2px)}
.fam-card.sel{border-color:var(--purple);box-shadow:0 0 0 3px var(--purple-50)}
.sig-line{display:flex;justify-content:space-between;align-items:center;font-size:12.3px;padding:4px 0;color:var(--text-2)}
.track{position:relative;height:64px;margin:10px 4px 4px}
.track-line{position:absolute;left:0;right:0;top:30px;height:4px;background:#E7EAF3;border-radius:4px}
.track-mark{position:absolute;top:18px;width:28px;height:28px;margin-left:-14px;border-radius:50%;display:grid;place-items:center;color:#fff;cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(14,23,51,.2);transition:transform .15s}
.track-mark:hover{transform:scale(1.15)}
.track-mark.dis{opacity:.35}
.track-ticks{display:flex;justify-content:space-between;font-size:11px;color:var(--faint);font-family:ui-monospace,Menlo,monospace}
.evidence-frame{border-radius:12px;aspect-ratio:16/9;background:linear-gradient(135deg,#14245E,#2E2470);position:relative;overflow:hidden;display:grid;place-items:center;color:#fff}
.evidence-frame .scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 2px,transparent 2px 4px)}
.wave{display:flex;align-items:center;gap:2px;height:60px}
.wave i{width:3px;border-radius:2px;background:rgba(255,255,255,.7);display:block}
.wave i.hl{background:#FF8A95}
.logbox{background:#0B1435;color:#B8C4F0;border-radius:10px;padding:12px 14px;font-family:ui-monospace,Menlo,monospace;font-size:12px;line-height:1.7;white-space:pre-wrap}

/* eval / report */
.dim-row{display:grid;grid-template-columns:1.4fr 70px 1fr 120px 1.2fr;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid var(--border-2)}
.dim-row:last-child{border-bottom:none}
.q-card{border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px;background:#fff}
.tr-line{display:flex;gap:12px;padding:10px 0}
.tr-line .ts{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--faint);width:62px;flex-shrink:0;padding-top:3px}
.rec-opt{border:1.5px solid var(--border);border-radius:12px;padding:14px;cursor:pointer;transition:all .15s;position:relative;background:#fff;text-align:left}
.rec-opt:hover{border-color:var(--purple-100)}
.rec-opt.sel{border-color:var(--purple);box-shadow:0 0 0 3px var(--purple-50)}
.rec-opt .ai-tag{position:absolute;top:-9px;right:10px;font-size:10px;font-weight:700;background:var(--navy-800);color:#fff;padding:2px 7px;border-radius:10px}
.sc-item{padding:14px 16px;border-bottom:1px solid var(--border-2);cursor:pointer;transition:background .12s;display:flex;gap:12px;align-items:center}
.sc-item:hover{background:#FAFBFE}.sc-item.sel{background:var(--purple-50)}
.report-hero{background:linear-gradient(120deg,var(--navy-900),var(--navy-700) 60%,#3B2F8F);color:#fff;border-radius:var(--radius) var(--radius) 0 0;padding:24px}
.tl{position:relative;padding-left:22px}
.tl::before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--border)}
.tl-item{position:relative;padding:0 0 14px}
.tl-item .tl-dot{position:absolute;left:-20px;top:4px;width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px var(--border)}
.drawer-ov{position:fixed;inset:0;background:rgba(7,15,43,.35);z-index:90;animation:ch-fade .15s}
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(520px,100%);background:#fff;z-index:91;box-shadow:var(--shadow-lg);display:flex;flex-direction:column;animation:ch-drawer .25s ease}

@keyframes ch-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes ch-fade{from{opacity:0}to{opacity:1}}
@keyframes ch-pop{from{opacity:0;transform:scale(.97) translateY(6px)}to{opacity:1;transform:none}}
@keyframes ch-slide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes ch-drawer{from{transform:translateX(100%)}to{transform:none}}
@keyframes ch-grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

@media (max-width:1280px){.g-6{grid-template-columns:repeat(3,minmax(0,1fr))}.g-5{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:1100px){.g-main,.room-grid,.g-side{grid-template-columns:minmax(0,1fr)}.g-4{grid-template-columns:repeat(2,minmax(0,1fr))}.dim-row{grid-template-columns:1fr 60px 1fr;}.dim-row .hide-md{display:none}}
@media (max-width:880px){
.ch-sidebar{position:fixed;left:0;top:0;transform:translateX(-100%)}
.ch-sidebar.open{transform:none;box-shadow:var(--shadow-lg)}
.ch-icon-btn.ch-menu-btn{display:grid}
.ch-topbar{padding:0 16px}
.ch-content{padding:20px 16px 36px}
.ch-user-meta,.ch-proto-pill{display:none}
.g-2,.g-3{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:560px){.g-4,.g-5,.g-6{grid-template-columns:repeat(2,minmax(0,1fr))}.ch-search{display:none}.kv{grid-template-columns:1fr}.pip{width:34%}}
.side-ov{display:none}
@media (max-width:880px){.side-ov.show{display:block;position:fixed;inset:0;background:rgba(7,15,43,.4);z-index:35}}
`;

/* ============================================================================
   ICONS (inline SVG, stroke style)
   ========================================================================== */
const ICONS = {
  dashboard: "M3 3h7v9H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 16h7v5H3z",
  calendar: "M3 5h18v16H3z M3 9h18 M8 3v4 M16 3v4",
  video: "M3 6h12v12H3z M15 10l6-3v10l-6-3",
  videoOff: "M3 3l18 18 M15 10l6-3v10 M5 6h8a2 2 0 0 1 2 2v6 M15 18H5a2 2 0 0 1-2-2V8",
  mic: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z M5 11a7 7 0 0 0 14 0 M12 18v3",
  micOff: "M3 3l18 18 M9 9v3a3 3 0 0 0 5.1 2.1 M15 9.3V6a3 3 0 0 0-5.9-.7 M5 11a7 7 0 0 0 11.4 5.4 M19 11a7 7 0 0 1-.6 2.8 M12 18v3",
  book: "M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z M4 17a3 3 0 0 1 3-3h11",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  shieldCheck: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M8.5 12l2.5 2.5 4.5-5",
  sparkles: "M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z",
  file: "M6 3h8l5 5v13H6z M14 3v5h5 M9 13h7 M9 17h7",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5-5",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10 21a2 2 0 0 0 4 0",
  plus: "M12 5v14 M5 12h14",
  x: "M6 6l12 12 M18 6L6 18",
  check: "M5 12l5 5L20 7",
  edit: "M4 20h4L19 9l-4-4L4 16z M14 6l4 4",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff: "M3 3l18 18 M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1 M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6 M9.9 9.9a3 3 0 0 0 4.2 4.2",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  copy: "M9 9h11v11H9z M5 15H4V4h11v1",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21a7 7 0 0 1 14 0 M16 3.5a4 4 0 0 1 0 7.5 M22 21a7 7 0 0 0-4-6.3",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
  alert: "M12 3l10 18H2z M12 10v5 M12 18h.01",
  flag: "M5 21V4 M5 4h11l-2 4 2 4H5",
  chevronLeft: "M15 6l-6 6 6 6",
  chevronRight: "M9 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  arrowRight: "M5 12h14 M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7 M8 7h9v9",
  filter: "M3 5h18l-7 8v6l-4 2v-8z",
  download: "M12 4v12 M7 11l5 5 5-5 M4 20h16",
  play: "M7 4l13 8-13 8z",
  stop: "M6 6h12v12H6z",
  phone: "M7 2h10v20H7z M11 18h2",
  monitor: "M3 4h18v12H3z M8 20h8 M12 16v4",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18",
  volume: "M4 9h4l5-4v14l-5-4H4z M17 9a4 4 0 0 1 0 6 M19.5 6.5a8 8 0 0 1 0 11",
  cpu: "M7 7h10v10H7z M10 10h4v4h-4z M9 3v4 M15 3v4 M9 17v4 M15 17v4 M3 9h4 M3 15h4 M17 9h4 M17 15h4",
  message: "M4 4h16v12H8l-4 4z",
  note: "M5 3h14v18H5z M9 7h6 M9 11h6 M9 15h4",
  lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  trend: "M3 17l6-6 4 4 8-8 M15 7h6v6",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  logout: "M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7",
  send: "M22 2L11 13 M22 2l-7 20-4-9-9-4z",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 11v5 M12 8h.01",
  briefcase: "M3 7h18v13H3z M8 7V4h8v3 M3 12h18",
  database: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  building: "M4 21V3h11v18 M15 9h5v12 M8 7h3 M8 11h3 M8 15h3 M2 21h20",
  mail: "M3 5h18v14H3z M3 6l9 7 9-7",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  scale: "M12 3v18 M5 21h14 M3 8l4-4 4 4 M3 8c0 2 1.8 3 4 3s4-1 4-3 M13 8l4-4 4 4 M13 8c0 2 1.8 3 4 3s4-1 4-3 M7 4h10",
  grip: "M9 5h.01 M15 5h.01 M9 12h.01 M15 12h.01 M9 19h.01 M15 19h.01",
  history: "M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 7v5l3 2",
  share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4",
  printer: "M6 9V3h12v6 M6 18H4v-7h16v7h-2 M6 14h12v7H6z",
};
function Icon({ name, size = 18, stroke = 1.9, style, className }) {
  const d = ICONS[name] || ICONS.info;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} className={className} aria-hidden="true">
      {d.split(" M").map((seg, i) => <path key={i} d={i === 0 ? seg : "M" + seg} />)}
    </svg>
  );
}

/* ============================================================================
   MOCK DATA
   ========================================================================== */
/* ---- Dates: sample data is anchored to the user's real local date so statuses stay realistic ---- */
const pad2 = (n) => String(n).padStart(2, "0");
const localISO = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const relDate = (offset) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return localISO(d); };
const relLabel = (offset, time) => `${new Date(relDate(offset) + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}${time ? ", " + time : ""}`;
const TODAY = localISO(new Date());

/* ---- Organization (defaults; edited values are persisted to localStorage) ---- */
const ORG_DEFAULT = {
  name: "Credang AI Solutions Private Limited",
  shortName: "Credang AI Solutions",
  domain: "credang.ai",
  industry: "Artificial Intelligence & Software Solutions",
  size: "51–200 employees",
  region: "India · APAC",
  timezone: "Asia/Kolkata (UTC+05:30)",
};
const ORG_STORAGE_KEY = "credang.orgProfile.v1";
function loadOrg() {
  try { const raw = window.localStorage.getItem(ORG_STORAGE_KEY); if (raw) return { ...ORG_DEFAULT, ...JSON.parse(raw) }; } catch (e) { /* storage unavailable */ }
  return ORG_DEFAULT;
}
function persistOrg(org) { try { window.localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(org)); return true; } catch (e) { return false; } }

const ADMIN_NAME = "Janani Iyappan";
const ADMIN_FIRST = ADMIN_NAME.split(" ")[0];
/* Time-of-day greeting: 5:00–11:59 morning · 12:00–16:59 afternoon · 17:00–4:59 evening */
function greetingFor(d) { const h = d.getHours(); if (h >= 5 && h < 12) return "Good morning"; if (h >= 12 && h < 17) return "Good afternoon"; return "Good evening"; }

const ROLES = ["Senior Backend Engineer", "Frontend Engineer", "Full Stack Engineer", "DevOps Engineer", "Data Scientist", "Product Manager"];

const SEED_USERS = [
  { id: "u1", name: ADMIN_NAME, email: "janani.iyappan@credang.ai", title: "Engineering Manager", role: "Admin", status: "Active", last: "Today, 10:42" },
  { id: "u2", name: "Marcus Chen", email: "marcus.chen@credang.ai", title: "Staff Engineer", role: "Interviewer", status: "Active", last: "Today, 09:15" },
  { id: "u3", name: "Priya Nair", email: "priya.nair@credang.ai", title: "Head of Data", role: "Interviewer", status: "Active", last: "Yesterday" },
  { id: "u4", name: "David Okafor", email: "david.okafor@credang.ai", title: "Senior Product Manager", role: "Interviewer", status: "Active", last: "Yesterday" },
  { id: "u5", name: "Sofia Martinez", email: "sofia.martinez@credang.ai", title: "Principal Engineer", role: "Interviewer", status: "Active", last: relLabel(-2) },
  { id: "u6", name: "Rohan Kapoor", email: "rohan.kapoor@credang.ai", title: "Talent Acquisition Lead", role: "Recruiter", status: "Active", last: "Today, 08:30" },
  { id: "u7", name: "Grace Liu", email: "grace.liu@credang.ai", title: "Hiring Coordinator", role: "Recruiter", status: "Invited", last: "—" },
];

/* ---- Candidates with parsed resume data (used by the AI question assistant) ---- */
const P = (name, desc, impact, tech) => ({ name, desc, impact, tech });
const RES = (file, title, summary, projects) => ({ file, title, summary, projects });
const cand = (name, email, phone, location, exp, company, skills, resume) => ({ name, email, phone, location, experience: exp, company, skills, resume: resume || RES(null, "", "", []) });

/*
 * Interview status is DERIVED from date/time + attendance (see deriveStatus):
 *  - stored status "Scheduled" → Scheduled until the slot ends, then Completed (candidate joined) or No Show (never joined)
 *  - "Cancelled", "In Progress" and "Completed" set by the app (cancel / interview room) are kept as-is
 * Attendance = `joinedAt`: the time the candidate opened the secure link, accepted consent and entered the room.
 */
const SEED_INTERVIEWS = [
  { id: "INT-1046", candidate: cand("Nikhil Sharma", "nikhil.sharma@gmail.com", "+91 98840 31277", "Chennai, IN", 4, "Zoho", ["Node.js", "React", "MongoDB", "Docker"], RES("Nikhil_Sharma_Resume.pdf", "Software Engineer", "Full stack engineer building CRM workflow tooling.", [P("CRM workflow builder", "built a drag-and-drop workflow builder in React backed by Node.js services", "cut custom-workflow setup time for customers by 50%", ["React", "Node.js", "MongoDB"])])), interviewer: "u5", role: "Full Stack Engineer", date: relDate(0), time: "09:00", duration: 45, status: "Scheduled", consent: false, joinedAt: null, link: "https://interview.credang.ai/join/INT-1046-r2v8n" },
  { id: "INT-1041", candidate: cand("Emily Carter", "emily.carter@gmail.com", "+44 7700 900461", "London, UK", 5, "Monzo", ["React", "TypeScript", "Accessibility", "GraphQL"], RES("Emily_Carter_Resume.pdf", "Senior Frontend Engineer", "Frontend engineer focused on accessible, high-performance fintech web apps.", [P("Monzo web app redesign", "rebuilt the account dashboard in React and TypeScript on a shared component library", "cut load time by 40% and raised the Lighthouse accessibility score from 72 to 98", ["React", "TypeScript", "GraphQL"]), P("Pebble design system", "created a token-based component library adopted by six product teams", "reduced UI bugs reported per release by about 30%", ["React", "Accessibility"])])), interviewer: "u2", role: "Frontend Engineer", date: relDate(0), time: "11:30", duration: 60, status: "Scheduled", consent: true, joinedAt: "11:26", link: "https://interview.credang.ai/join/INT-1041-p4k7d" },
  { id: "INT-1042", candidate: cand("Rahul Verma", "rahul.verma@outlook.com", "+91 98450 22113", "Bengaluru, IN", 7, "Flipkart", ["Go", "Kafka", "PostgreSQL", "AWS"], RES("Rahul_Verma_Resume.pdf", "Senior Software Engineer II", "Backend engineer building high-throughput commerce systems.", [P("Order ledger migration", "moved the order service from a single PostgreSQL table to an event-driven ledger using Kafka and the outbox pattern", "eliminated weekly reconciliation incidents during peak sale events", ["Go", "Kafka", "PostgreSQL"]), P("Inventory reservation API", "designed a Go service handling 60k requests per second with Redis-based reservations", "reduced overselling by 92%", ["Go", "Redis", "AWS"])])), interviewer: "u1", role: "Senior Backend Engineer", date: relDate(0), time: "14:00", duration: 60, status: "Scheduled", consent: false, joinedAt: null, link: null },
  { id: "INT-1047", candidate: cand("Aisha Khan", "aisha.khan@gmail.com", "+91 99620 11845", "Hyderabad, IN", 3, "Razorpay", ["React", "Next.js", "Testing", "CSS"], RES("Aisha_Khan_Resume.pdf", "Frontend Engineer", "Frontend engineer working on payments checkout experiences.", [P("Merchant checkout SDK", "built an embeddable React checkout widget used by thousands of merchants", "raised checkout conversion by 6%", ["React", "Next.js"]), P("Visual regression suite", "introduced Playwright visual tests into the CI pipeline", "caught more than 40 UI regressions before release", ["Testing", "CI/CD"])])), interviewer: "u2", role: "Frontend Engineer", date: relDate(0), time: "17:30", duration: 60, status: "Scheduled", consent: false, joinedAt: null, link: null },
  { id: "INT-1043", candidate: cand("Vikram Singh", "vikram.s@protonmail.com", "+91 99001 77821", "Pune, IN", 4, "Fractal Analytics", ["Python", "XGBoost", "SQL", "Experimentation"], RES("Vikram_Singh_Resume.pdf", "Data Scientist", "Applied data scientist focused on churn modelling and experimentation.", [P("Telecom churn model", "built an XGBoost churn model with point-in-time features for a telecom client", "improved retention campaign ROI by 18%", ["Python", "XGBoost", "SQL"]), P("Pricing experimentation framework", "set up an A/B testing framework with CUPED variance reduction", "shortened average test duration by 30%", ["Python", "Experimentation"])])), interviewer: "u3", role: "Data Scientist", date: relDate(1), time: "10:30", duration: 60, status: "Scheduled", consent: false, joinedAt: null, link: null },
  { id: "INT-1044", candidate: cand("Chloe Dubois", "chloe.dubois@gmail.com", "+33 6 12 34 56 78", "Paris, FR", 6, "Doctolib", ["Roadmapping", "B2B SaaS", "Analytics"], RES("Chloe_Dubois_Resume.pdf", "Senior Product Manager", "B2B product manager in healthcare SaaS.", [P("Clinic scheduling suite", "led discovery and delivery of a multi-practitioner scheduling product for clinics", "grew B2B clinic accounts by 25% in a year", ["B2B SaaS", "Discovery"]), P("Self-serve analytics", "launched usage dashboards for clinic administrators", "reduced support tickets by 20%", ["Analytics", "Roadmapping"])])), interviewer: "u4", role: "Product Manager", date: relDate(2), time: "15:00", duration: 45, status: "Scheduled", consent: false, joinedAt: null, link: null },
  { id: "INT-1045", candidate: cand("Diego Alvarez", "diego.alvarez@gmail.com", "+34 612 345 678", "Madrid, ES", 8, "Glovo", ["Kubernetes", "Terraform", "AWS", "Observability"], RES("Diego_Alvarez_Resume.pdf", "Staff Site Reliability Engineer", "SRE leading platform and reliability work.", [P("Kubernetes platform migration", "migrated 120 services from EC2 to EKS with Terraform-managed clusters", "cut infrastructure cost by 22%", ["Kubernetes", "Terraform", "AWS"]), P("Observability overhaul", "rolled out OpenTelemetry tracing and SLO-based alerting", "reduced mean time to recovery from 48 to 15 minutes", ["Observability"])])), interviewer: "u5", role: "DevOps Engineer", date: relDate(3), time: "12:00", duration: 60, status: "Scheduled", consent: false, joinedAt: null, link: null },
  { id: "INT-1040", candidate: cand("Arjun Mehta", "arjun.mehta@gmail.com", "+91 98200 55410", "Mumbai, IN", 3, "Mu Sigma", ["Python", "Pandas", "scikit-learn", "Tableau"], RES("Arjun_Mehta_Resume.pdf", "Senior Analyst", "Analyst moving into data science.", [P("Retail demand forecasting", "built demand forecasts for a retail client with scikit-learn", "reduced stock-outs by 12%", ["Python", "scikit-learn"])])), interviewer: "u3", role: "Data Scientist", date: relDate(-1), time: "15:30", duration: 60, status: "Scheduled", consent: true, joinedAt: "15:28", link: "https://interview.credang.ai/join/INT-1040-q8f2k" },
  { id: "INT-1039", candidate: cand("Lena Fischer", "lena.fischer@web.de", "+49 151 2345 6789", "Berlin, DE", 7, "N26", ["Product Strategy", "Fintech", "SQL", "Discovery"], RES("Lena_Fischer_Resume.pdf", "Lead Product Manager", "Fintech product leader.", [P("Savings goals launch", "led the savings goals product from discovery to general availability", "reached 18% adoption in the first quarter", ["Discovery", "Fintech"])])), interviewer: "u4", role: "Product Manager", date: relDate(-1), time: "10:00", duration: 45, status: "Scheduled", consent: true, joinedAt: "09:57", link: "https://interview.credang.ai/join/INT-1039-m3x9a" },
  { id: "INT-1038", candidate: cand("Kwame Asante", "kwame.asante@gmail.com", "+233 24 123 4567", "Accra, GH", 6, "Andela", ["AWS", "Terraform", "CI/CD", "Linux"], RES("Kwame_Asante_Resume.pdf", "DevOps Engineer", "DevOps engineer for distributed client teams.", [P("CI/CD standardisation", "standardised CI/CD pipelines across 30 client repositories", "cut average deploy time from 25 to 8 minutes", ["CI/CD", "AWS"])])), interviewer: "u5", role: "DevOps Engineer", date: relDate(-2), time: "16:00", duration: 60, status: "Scheduled", consent: true, joinedAt: "15:58", link: "https://interview.credang.ai/join/INT-1038-z7p1d" },
  { id: "INT-1033", candidate: cand("Tom Becker", "tom.becker@gmail.com", "+49 160 5512 334", "Munich, DE", 5, "Celonis", ["Linux", "Ansible", "GCP"], RES("Tom_Becker_Resume.pdf", "Platform Engineer", "Platform engineer on GCP.", [P("GCP landing zone", "automated GCP project provisioning with Ansible and Terraform", "reduced environment setup from days to hours", ["GCP", "Ansible"])])), interviewer: "u5", role: "DevOps Engineer", date: relDate(-3), time: "10:00", duration: 60, status: "Scheduled", consent: false, joinedAt: null, link: "https://interview.credang.ai/join/INT-1033-t6y2m" },
  { id: "INT-1037", candidate: cand("Mei Lin", "mei.lin@outlook.com", "+65 9123 4567", "Singapore, SG", 5, "Grab", ["Node.js", "React", "PostgreSQL", "Redis"], RES("Mei_Lin_Resume.pdf", "Software Engineer", "Full stack engineer in ride-hailing.", [P("Driver earnings dashboard", "built a React and Node.js earnings dashboard backed by PostgreSQL", "served 2 million monthly driver sessions", ["React", "Node.js", "PostgreSQL"])])), interviewer: "u2", role: "Full Stack Engineer", date: relDate(-3), time: "13:00", duration: 60, status: "Scheduled", consent: true, joinedAt: "12:58", link: "https://interview.credang.ai/join/INT-1037-c4n8w" },
  { id: "INT-1036", candidate: cand("Omar Haddad", "omar.haddad@gmail.com", "+971 50 123 4567", "Dubai, AE", 9, "Careem", ["Java", "Spring", "Microservices", "Kafka"], RES("Omar_Haddad_Resume.pdf", "Senior Backend Engineer", "Backend engineer in mobility and payments.", [P("Wallet microservices", "split the wallet monolith into Spring Boot microservices", "improved deployment frequency from monthly to daily", ["Java", "Spring", "Kafka"])])), interviewer: "u1", role: "Senior Backend Engineer", date: relDate(-4), time: "11:30", duration: 60, status: "Scheduled", consent: true, joinedAt: "11:29", link: "https://interview.credang.ai/join/INT-1036-h2r6t" },
  { id: "INT-1035", candidate: cand("Sarah Johnson", "sarah.j@gmail.com", "+1 415 555 0132", "Austin, US", 4, "Indeed", ["Vue", "React", "CSS", "Testing"], RES("Sarah_Johnson_Resume.pdf", "Frontend Engineer", "Frontend engineer on job search UI.", [P("Search results revamp", "migrated job search results from Vue to React", "improved click-through by 9%", ["React", "Vue"])])), interviewer: "u5", role: "Frontend Engineer", date: relDate(-5), time: "17:00", duration: 60, status: "Cancelled", consent: false, joinedAt: null, link: null },
  { id: "INT-1034", candidate: cand("Hannah Kim", "hannah.kim@gmail.com", "+82 10 1234 5678", "Seoul, KR", 4, "Kakao", ["TypeScript", "Node.js", "AWS", "React"], RES("Hannah_Kim_Resume.pdf", "Software Engineer", "Full stack engineer on messaging features.", [P("Group chat media service", "built a TypeScript media upload service on AWS", "handled 3x peak traffic during new-year events", ["TypeScript", "AWS"])])), interviewer: "u1", role: "Full Stack Engineer", date: relDate(-6), time: "09:30", duration: 60, status: "Scheduled", consent: true, joinedAt: "09:27", link: "https://interview.credang.ai/join/INT-1034-b9k3s" },
];

const FAMILIES = {
  Browser: { icon: "globe", color: "#3366F0", bg: "#EAF0FE", weight: 5, wLabel: "Medium", label: "Browser Monitoring", how: "JS events + Integrity Agent extension", signals: ["Tab switching", "Copy / paste", "Window blur", "Fullscreen exit"] },
  Video: { icon: "video", color: "#6C5CE7", bg: "#F1EFFE", weight: 9, wLabel: "High", label: "Video Monitoring", how: "Face/object detection on sampled frames (1 fps)", signals: ["Face detection", "Multiple faces", "Gaze direction", "Phone detection"] },
  Audio: { icon: "volume", color: "#0A9DB0", bg: "#E4F6F8", weight: 9, wLabel: "High", label: "Audio Monitoring", how: "Speaker diarization + voice activity detection", signals: ["Second speaker", "Whispering", "Background sounds"] },
  Answer: { icon: "sparkles", color: "#C53D9C", bg: "#FBEAF5", weight: 6, wLabel: "Medium", label: "Answer Analysis", how: "LLM classifier + response timing statistics", signals: ["AI-generated indicators", "Unusual response patterns"] },
  Device: { icon: "cpu", color: "#D98A06", bg: "#FDF4E3", weight: 6, wLabel: "Medium", label: "Device Monitoring", how: "Integrity Agent + device fingerprint checks", signals: ["Virtual machine", "Remote desktop"] },
};
const FAMILY_KEYS = Object.keys(FAMILIES);

let _eid = 100;
const ev = (iid, family, signal, ts, sev, conf, desc, evidence, extra = {}) => ({ id: "EV-" + (++_eid), iid, family, signal, ts, sev, conf, desc, evidence, status: "active", notes: [], hard: false, ...extra });
const SEED_EVENTS = [
  // INT-1036 Omar — HIGH
  ev("INT-1036", "Browser", "Tab switching", "00:06:42", 2, 0.99, "Candidate switched away from the interview tab for 18 seconds during Q1.", { kind: "log", detail: "visibilitychange → hidden  06:42.11\nvisibilitychange → visible 06:42.29\nduration: 18.2 s · focus target: unknown tab" }),
  ev("INT-1036", "Video", "Multiple faces", "00:14:05", 3, 0.94, "A second face was visible at the left edge of the frame for 14 seconds.", { kind: "frame", detail: "Frames 843–857 · 2 faces detected · face #2 bounding box at left edge (x: 4%, y: 22%)" }, { hard: true, rule: "Second face > 10 s → instant HIGH" }),
  ev("INT-1036", "Audio", "Second speaker", "00:14:20", 3, 0.86, "Diarization detected a second distinct voice while the candidate was answering Q2.", { kind: "audio", detail: "Speaker B: 6.2 s of speech overlapping candidate answer · pitch profile differs from candidate baseline" }),
  ev("INT-1036", "Video", "Phone detection", "00:22:31", 2, 0.88, "Object classified as a mobile phone appeared in the lower part of the frame.", { kind: "frame", detail: "Frames 1351–1356 · object class: cell phone · position: lower-right quadrant" }),
  ev("INT-1036", "Answer", "AI-generated indicators", "00:27:10", 2, 0.78, "Answer to Q4 followed a 9 s silence, then high-fluency text with near-zero disfluency (pause-then-perfect pattern).", { kind: "text", detail: "Pause before answer: 9.1 s (candidate median 1.8 s)\nDisfluency rate: 0.2 / min (candidate median 4.6 / min)\nClassifier score: 0.78" }),
  // INT-1040 Arjun — HIGH
  ev("INT-1040", "Device", "Remote desktop", "00:00:30", 2, 0.70, "A remote-desktop process signature was detected at join time.", { kind: "log", detail: "process signature match: remote-access client (background)\nscreen-share session: not confirmed" }),
  ev("INT-1040", "Browser", "Tab switching", "00:08:15", 2, 0.99, "Candidate left the interview tab for 26 seconds immediately after Q2 was asked.", { kind: "log", detail: "visibilitychange → hidden  08:15.02\nvisibilitychange → visible 08:41.30\nduration: 26.3 s" }),
  ev("INT-1040", "Browser", "Copy / paste", "00:08:42", 3, 0.99, "412 characters pasted into the shared code editor right after returning to the tab.", { kind: "log", detail: "paste event · target: shared editor · length: 412 chars\nsource: external clipboard" }),
  ev("INT-1040", "Browser", "Tab switching", "00:19:02", 2, 0.99, "Second tab switch of 31 seconds during Q3.", { kind: "log", detail: "visibilitychange → hidden  19:02.44\nvisibilitychange → visible 19:33.80\nduration: 31.4 s" }),
  ev("INT-1040", "Answer", "AI-generated indicators", "00:19:40", 3, 0.82, "Answer to Q3 used textbook-structured phrasing inconsistent with earlier answers.", { kind: "text", detail: "Lexical similarity to earlier answers: low (0.31)\nStructured enumeration detected (\"Firstly… Secondly… In conclusion…\")\nClassifier score: 0.82" }),
  ev("INT-1040", "Video", "Gaze direction", "00:31:12", 1, 0.74, "Sustained off-screen gaze to the left for 22 seconds.", { kind: "frame", detail: "Gaze vector: left (−34°) for 22 s · frames 1872–1894" }),
  // INT-1038 Kwame — MEDIUM
  ev("INT-1038", "Device", "Virtual machine", "00:00:12", 2, 0.90, "Browser environment reports a virtualised GPU renderer typical of virtual machines.", { kind: "log", detail: "WebGL renderer: virtualised adapter\nhardware concurrency: 2 · device memory: 4 GB" }),
  ev("INT-1038", "Browser", "Window blur", "00:11:47", 1, 0.99, "Interview window lost focus for 6 seconds.", { kind: "log", detail: "window blur 11:47.10 → focus 11:53.22" }),
  ev("INT-1038", "Audio", "Whispering", "00:23:05", 2, 0.62, "Low-volume speech detected under the candidate's answer.", { kind: "audio", detail: "Whisper-band energy above threshold for 4.1 s · confidence moderate due to fan noise" }),
  ev("INT-1038", "Browser", "Fullscreen exit", "00:30:20", 1, 0.99, "Candidate exited fullscreen during the live coding exercise.", { kind: "log", detail: "fullscreenchange → exit 30:20.05 · re-entered 30:41.70" }),
  // INT-1039 Lena — LOW
  ev("INT-1039", "Browser", "Window blur", "00:18:03", 1, 0.99, "Interview window lost focus for 3 seconds.", { kind: "log", detail: "window blur 18:03.40 → focus 18:06.52" }),
  ev("INT-1039", "Audio", "Background sounds", "00:24:50", 1, 0.71, "Intermittent hammering noise in background.", { kind: "audio", detail: "Impulse noise pattern · non-speech" }, { status: "dismissed", notes: [{ by: "David Okafor", at: relLabel(-1, "10:52"), text: "Construction noise next door — candidate mentioned it at the start. Not relevant." }] }),
  // INT-1037 Mei — LOW
  ev("INT-1037", "Video", "Gaze direction", "00:33:40", 1, 0.60, "Off-screen gaze downward for 12 seconds.", { kind: "frame", detail: "Gaze vector: down (−28°) for 12 s · candidate was sketching on paper (visible)" }),
  // INT-1034 Hannah — LOW
  ev("INT-1034", "Browser", "Tab switching", "00:15:22", 2, 0.99, "Candidate switched tabs for 9 seconds.", { kind: "log", detail: "visibilitychange → hidden 15:22.01 → visible 15:31.12" }),
  ev("INT-1034", "Audio", "Background sounds", "00:41:05", 1, 0.70, "Dog barking in background.", { kind: "audio", detail: "Non-speech impulse noise · 3 bursts" }),
];

/* simulated live signals for the Interview Room (seconds after start) */
const LIVE_SCRIPT = [
  { at: 9, family: "Browser", signal: "Window blur", sev: 1, conf: 0.99, desc: "Interview window lost focus for 4 seconds.", evidence: { kind: "log", detail: "window blur → focus after 4.2 s" } },
  { at: 22, family: "Video", signal: "Gaze direction", sev: 1, conf: 0.71, desc: "Sustained off-screen gaze to the right for 15 seconds.", evidence: { kind: "frame", detail: "Gaze vector: right (+31°) for 15 s" } },
  { at: 38, family: "Browser", signal: "Tab switching", sev: 2, conf: 0.99, desc: "Candidate switched to another tab for 12 seconds.", evidence: { kind: "log", detail: "visibilitychange → hidden → visible after 12.4 s" } },
  { at: 55, family: "Audio", signal: "Background sounds", sev: 1, conf: 0.66, desc: "Keyboard bursts detected while the candidate was speaking.", evidence: { kind: "audio", detail: "Keystroke impulses: 41 in 8 s during answer" } },
  { at: 75, family: "Answer", signal: "Unusual response patterns", sev: 2, conf: 0.69, desc: "Long pause followed by unusually fluent answer.", evidence: { kind: "text", detail: "Pause 7.8 s · disfluency rate 0.4/min vs baseline 3.9/min" } },
];

const SEED_QUESTIONS = [
  { id: "Q-101", text: "Design a rate limiter for a public API serving 50k requests per second. What trade-offs would you consider?", category: "Technical", topic: "System Design", difficulty: "Hard", dim: "tech", time: 15, rubric: { 5: "Token/leaky bucket with atomic ops, sharding strategy, fail-open vs fail-closed, burst handling.", 3: "Reasonable algorithm, limited discussion of distribution or failure modes.", 1: "No coherent algorithm; ignores scale." }, usage: 38 },
  { id: "Q-102", text: "A production service's memory grows steadily until it is OOM-killed every ~6 hours. How do you investigate?", category: "Technical", topic: "Debugging", difficulty: "Medium", dim: "problem", time: 10, rubric: { 5: "Hypothesis-driven: confirm leak vs cache, heap diffing, recent-change analysis, mitigation while investigating.", 3: "Uses some tooling but unstructured.", 1: "Guesses without method." }, usage: 41 },
  { id: "Q-103", text: "How would you make a payment-processing endpoint idempotent?", category: "Technical", topic: "System Design", difficulty: "Medium", dim: "tech", time: 10, rubric: { 5: "Idempotency keys, request hashing, unique constraints, payload mismatch handling, key TTL.", 3: "Mentions keys but misses edge cases.", 1: "Confuses idempotency with retries." }, usage: 27 },
  { id: "Q-104", text: "Explain how React reconciliation works and when you would reach for useMemo or useCallback.", category: "Technical", topic: "Frontend", difficulty: "Medium", dim: "tech", time: 10, rubric: { 5: "Explains diffing, keys, referential equality; knows memoization costs.", 3: "Partial understanding of re-render triggers.", 1: "Cannot explain re-rendering." }, usage: 19 },
  { id: "Q-105", text: "Given an array of meeting intervals, return the minimum number of rooms required.", category: "Technical", topic: "Algorithms", difficulty: "Easy", dim: "problem", time: 15, rubric: { 5: "Sort + min-heap or sweep line, O(n log n), handles edge cases.", 3: "Works with hints; brute force first.", 1: "No working approach." }, usage: 52 },
  { id: "Q-201", text: "Tell me about a time you disagreed with a technical decision made by your team.", category: "Behavioral", topic: "Collaboration", difficulty: "Medium", dim: "comm", time: 8, rubric: { 5: "Clear STAR story, data-backed disagreement, respectful, outcome and learning stated.", 3: "Story present but vague on actions or outcome.", 1: "Blames others; no resolution." }, usage: 64 },
  { id: "Q-202", text: "Which project from your last role is most relevant to this position, and what was your specific contribution?", category: "Behavioral", topic: "Experience", difficulty: "Easy", dim: "fit", time: 8, rubric: { 5: "Concrete, quantified impact that maps to the job description.", 3: "Relevant project, unclear personal contribution.", 1: "Irrelevant or generic." }, usage: 71 },
  { id: "Q-203", text: "Explain a complex technical concept you worked on to a non-technical stakeholder.", category: "Behavioral", topic: "Communication", difficulty: "Easy", dim: "comm", time: 8, rubric: { 5: "Uses analogy, checks understanding, avoids jargon.", 3: "Mostly clear but jargon-heavy.", 1: "Unclear or condescending." }, usage: 33 },
  { id: "Q-204", text: "Describe a time you had to deliver under a deadline that you believed was unrealistic.", category: "Behavioral", topic: "Leadership", difficulty: "Medium", dim: "comm", time: 8, rubric: { 5: "Negotiated scope, communicated risk early, delivered value.", 3: "Delivered but with poor communication.", 1: "Missed without escalation." }, usage: 22 },
  { id: "Q-301", text: "How would you detect and prevent data leakage when building a churn prediction model?", category: "Technical", topic: "Data Science", difficulty: "Hard", dim: "tech", time: 12, rubric: { 5: "Temporal splits, feature audit vs label timing, pipeline-fitted transforms, leakage tests.", 3: "Knows train/test split but misses temporal leakage.", 1: "Unaware of leakage." }, usage: 14 },
  { id: "Q-302", text: "Your A/B test shows a 4% lift but the p-value is 0.07. What do you tell the product team?", category: "Technical", topic: "Data Science", difficulty: "Medium", dim: "problem", time: 10, rubric: { 5: "Discusses power, CI, practical significance, pre-registration; recommends next step.", 3: "Says 'not significant' without nuance.", 1: "Misinterprets p-value." }, usage: 17 },
  { id: "Q-303", text: "Explain the bias–variance trade-off and how it shows up in gradient boosting.", category: "Technical", topic: "Data Science", difficulty: "Medium", dim: "tech", time: 8, rubric: { 5: "Links depth, learning rate, n_estimators and regularisation to bias/variance.", 3: "Generic definition only.", 1: "Incorrect definition." }, usage: 12 },
  { id: "Q-401", text: "How would you prioritise a backlog with three urgent requests from three different VPs?", category: "Behavioral", topic: "Product Sense", difficulty: "Medium", dim: "problem", time: 10, rubric: { 5: "Framework tied to company goals, transparent trade-offs, stakeholder alignment.", 3: "Uses a framework mechanically.", 1: "Picks the loudest stakeholder." }, usage: 11 },
  { id: "Q-402", text: "Pick a product you use daily. What would you choose as its north-star metric and why?", category: "Technical", topic: "Product Sense", difficulty: "Medium", dim: "tech", time: 10, rubric: { 5: "Metric reflects delivered value, has guardrails, explains leading indicators.", 3: "Reasonable metric, weak reasoning.", 1: "Vanity metric." }, usage: 15 },
  { id: "Q-403", text: "Walk me through how you would roll out a new feature to 10% of users.", category: "Technical", topic: "Product Sense", difficulty: "Easy", dim: "tech", time: 8, rubric: { 5: "Flags, cohort selection, success + guardrail metrics, rollback plan.", 3: "Mentions flags only.", 1: "No staged approach." }, usage: 9 },
];

const QA_LIB = {
  eng: [
    { qid: "Q-101", answer: "I'd start with a token bucket per API key, stored in Redis with a Lua script so check-and-decrement is atomic. At 50k RPS a single Redis node becomes a hotspot, so I'd shard by key and accept slight over-admission at shard boundaries. Bucket size matters more than refill rate for burst tolerance.", evidence: "I'd shard by key and accept slight over-admission at shard boundaries", feedback: "Strong grasp of atomicity and sharding trade-offs. Did not discuss behaviour when Redis is unavailable (fail-open vs fail-closed)." },
    { qid: "Q-102", answer: "First I'd confirm it's a real leak and not a cache warming up — compare heap after full GC over time. Then take two heap snapshots an hour apart and diff retained objects. I'd also look at what changed in the last deploy, and ask how often we deploy, because a leak hidden by frequent restarts is common.", evidence: "take two heap snapshots an hour apart and diff retained objects", feedback: "Structured, hypothesis-driven approach and a good clarifying question. Could mention short-term mitigation while investigating." },
    { qid: "Q-201", answer: "My team wanted to move to microservices for a product with four engineers. I wrote a one-page doc comparing the deployment overhead against our actual bottleneck, which was one slow query. We agreed to fix the query and revisit in six months — we never needed to split.", evidence: "I wrote a one-page doc comparing the deployment overhead against our actual bottleneck", feedback: "Clear STAR structure with a data-backed disagreement and stated outcome. Good collaboration signals." },
    { qid: "Q-103", answer: "Clients send an idempotency key; we store the key, a hash of the request and the response in a table with a unique constraint. A retry with the same key returns the stored response. If the same key arrives with a different payload, we return 422.", evidence: "If the same key arrives with a different payload, we return 422", feedback: "Covers the core pattern and the payload-mismatch edge case. Missing discussion of key expiry and concurrent in-flight requests." },
    { qid: "Q-202", answer: "I led the migration of our order service to an event-driven model — I designed the outbox pattern and wrote the backfill tooling. Reconciliation incidents went from roughly weekly to zero over a quarter.", evidence: "Reconciliation incidents went from roughly weekly to zero over a quarter", feedback: "Concrete, quantified outcome that maps well to the role's distributed-systems requirements." },
  ],
  data: [
    { qid: "Q-301", answer: "The main risk is temporal leakage — features computed after the churn date. I'd build a point-in-time feature store, split by time not randomly, and fit scalers inside the pipeline. I also train a model on only the suspicious features; if it scores too well, that's a red flag.", evidence: "I also train a model on only the suspicious features; if it scores too well, that's a red flag", feedback: "Excellent practical leakage detection technique. Strong temporal reasoning." },
    { qid: "Q-302", answer: "I'd say the result is promising but inconclusive. I'd check whether the test was powered for a 4% effect, show the confidence interval, and if the downside is low, propose extending the test rather than shipping or killing it.", evidence: "check whether the test was powered for a 4% effect, show the confidence interval", feedback: "Balanced and decision-oriented. Could quantify the extra sample size needed." },
    { qid: "Q-203", answer: "I explained our recommendation model to the sales team as a 'people who bought this also bought' list that learns from every order. I then asked them to predict what it would show for two real customers, which helped them trust it.", evidence: "I then asked them to predict what it would show for two real customers", feedback: "Good analogy and an active check for understanding." },
    { qid: "Q-303", answer: "Firstly, bias is error from wrong assumptions, variance from sensitivity to data. Secondly, in boosting, more trees and deeper trees reduce bias but raise variance, so we tune learning rate and use early stopping. In conclusion, regularisation balances the two.", evidence: "more trees and deeper trees reduce bias but raise variance, so we tune learning rate and use early stopping", feedback: "Correct but textbook-like; limited personal examples of tuning." },
    { qid: "Q-202", answer: "At my last role I built the propensity model for a telecom client's retention campaign. I owned feature engineering and the uplift evaluation; the campaign reduced churn in the target segment by about 3 points.", evidence: "the campaign reduced churn in the target segment by about 3 points", feedback: "Relevant churn modelling experience with measurable outcome." },
  ],
  pm: [
    { qid: "Q-401", answer: "I'd map each request to our quarterly goals and estimate impact and effort, then share that view with all three VPs together, so the trade-off is explicit rather than negotiated one-on-one. Usually one request clearly wins, and we agree dates for the others.", evidence: "share that view with all three VPs together, so the trade-off is explicit", feedback: "Mature stakeholder management with transparent prioritisation." },
    { qid: "Q-402", answer: "For a banking app I'd pick weekly active users who complete a money movement. It reflects real value, not just opens. I'd pair it with a guardrail on failed transactions and support contacts.", evidence: "I'd pair it with a guardrail on failed transactions and support contacts", feedback: "Value-based metric with sensible guardrails. Strong product sense." },
    { qid: "Q-203", answer: "When we introduced instant payouts, I explained settlement risk to marketing as 'lending the customer money for two days'. That framing helped them understand why limits existed.", evidence: "lending the customer money for two days", feedback: "Memorable analogy, tailored to audience." },
    { qid: "Q-403", answer: "Feature flag, random 10% cohort excluding enterprise accounts, define one success metric and two guardrails upfront, monitor daily, and have a one-click rollback owned by on-call.", evidence: "define one success metric and two guardrails upfront", feedback: "Complete rollout plan including rollback ownership." },
    { qid: "Q-202", answer: "At N26 I led the savings goals launch from discovery to GA. I ran 24 customer interviews, cut scope to three core flows and we hit 18% adoption in the first quarter.", evidence: "we hit 18% adoption in the first quarter", feedback: "Strong end-to-end ownership with quantified impact." },
  ],
};
const roleSet = (role) => (role === "Data Scientist" ? "data" : role === "Product Manager" ? "pm" : "eng");

const DIMS = [
  { key: "tech", label: "Technical Depth", looks: "Correctness, trade-offs, edge cases" },
  { key: "problem", label: "Problem Solving", looks: "Structure, clarifying questions, iteration" },
  { key: "comm", label: "Communication", looks: "Clarity, conciseness, listening" },
  { key: "fit", label: "Experience Fit", looks: "Match to JD skills, concrete examples" },
];
const DEFAULT_WEIGHTS = { tech: 35, problem: 25, comm: 20, fit: 20 };

const EVAL_PROFILES = {
  "INT-1040": { dims: [4, 3, 4, 4], q: [4, 3, 4, 3, 4] },
  "INT-1039": { dims: [5, 4, 5, 4], q: [5, 4, 5, 4, 5], signed: "Strong Hire", review: "Exceptional product thinking and stakeholder skills. Clear owner mentality. Recommend fast-tracking to the final round with the CPO." },
  "INT-1038": { dims: [3, 4, 3, 4], q: [3, 4, 3, 3, 4] },
  "INT-1037": { dims: [4, 4, 4, 5], q: [4, 4, 4, 4, 5], signed: "Hire", review: "Solid full-stack fundamentals, very collaborative. Gaze flag was explained by note-taking on paper (visible on camera) — not a concern." },
  "INT-1036": { dims: [2, 2, 3, 3], q: [3, 2, 3, 2, 3] },
  "INT-1034": { dims: [4, 3, 4, 3], q: [4, 3, 4, 4, 3] },
};

function tsAdd(base, sec) { const s = base + sec; const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return [h, m, x].map((n) => String(n).padStart(2, "0")).join(":"); }

function makeEval(iv, profile = { dims: [3, 3, 3, 3], q: [3, 3, 3, 3, 3] }) {
  const lib = QA_LIB[roleSet(iv.role)];
  const qBank = Object.fromEntries(SEED_QUESTIONS.map((q) => [q.id, q]));
  const questions = lib.map((qa, i) => ({ ...qa, question: qBank[qa.qid].text, dim: qBank[qa.qid].dim, ai: profile.q[i] ?? 3, override: null, reason: "", ts: tsAdd(120, i * 420 + 25) }));
  const transcript = [{ t: "00:00:40", sp: "Interviewer", text: `Hi ${iv.candidate.name.split(" ")[0]}, thanks for joining. This session is recorded and monitored as described in the consent screen. Ready to begin?` }, { t: "00:00:52", sp: "Candidate", text: "Yes, ready. Thanks for having me." }];
  questions.forEach((q, i) => {
    transcript.push({ t: tsAdd(120, i * 420), sp: "Interviewer", text: q.question });
    transcript.push({ t: q.ts, sp: "Candidate", text: q.answer, evidence: q.evidence });
    if (i === 1) transcript.push({ t: tsAdd(120, i * 420 + 210), sp: "Interviewer", text: "Good — and what would you do in the meantime to limit customer impact?" }, { t: tsAdd(120, i * 420 + 222), sp: "Candidate", text: "I'd tighten the restart policy and add an alert on heap growth rate so we don't page on the OOM itself." });
  });
  transcript.push({ t: tsAdd(120, 5 * 420), sp: "Interviewer", text: "That's all from me. Do you have any questions for us?" });
  const dims = {}; DIMS.forEach((d, i) => { dims[d.key] = { ai: profile.dims[i], override: null, reason: "" }; });
  return { iid: iv.id, dims, questions, transcript, review: profile.review || "", decision: profile.signed || null, signedOff: !!profile.signed, signedBy: profile.signed ? (SEED_USERS.find((u) => u.id === iv.interviewer) || {}).name : null, signedAt: profile.signed ? iv.date : null, liveNotes: "", generatedAt: iv.date };
}
function buildSeedEvals() { const o = {}; SEED_INTERVIEWS.forEach((iv) => { if (EVAL_PROFILES[iv.id]) o[iv.id] = makeEval(iv, EVAL_PROFILES[iv.id]); }); return o; }

const ACTIVITY = { labels: Array.from({ length: 8 }, (_, i) => relLabel(-7 * (7 - i))), conducted: [14, 18, 16, 22, 19, 25, 23, 12], flagged: [2, 3, 1, 4, 2, 3, 4, 2] };

const DEFAULT_SETTINGS = {
  weights: { ...DEFAULT_WEIGHTS },
  duration: 60, recording: true, transcription: true, aiEval: true, bufferMin: 10, linkExpiry: "48h", requireFullscreen: true,
  signals: { Browser: true, Video: true, Audio: true, Answer: true, Device: true },
  sensitivity: "Balanced",
  notif: { email_high: true, live_alert: true, digest: true, eval_ready: true, cancel: true, slack: false, sms: false },
  retention: 90, transcriptRetention: 180, piiMasking: true, consentRequired: true, anonymiseReports: false, region: "AWS ap-south-1 (Mumbai)",
};

/* ============================================================================
   HELPERS
   ========================================================================== */
const userById = (id, users = SEED_USERS) => users.find((u) => u.id === id) || { name: "Unassigned", title: "", email: "" };
function computeRisk(events) {
  const act = events.filter((e) => e.status !== "dismissed");
  let s = act.reduce((a, e) => a + FAMILIES[e.family].weight * e.sev * e.conf, 0);
  if (act.some((e) => e.hard)) s = Math.max(s, 65);
  return Math.min(100, Math.round(s));
}
const contribution = (e) => Math.round(FAMILIES[e.family].weight * e.sev * e.conf * 10) / 10;
const riskLevel = (s) => (s <= 30 ? "LOW" : s <= 60 ? "MEDIUM" : "HIGH");
const riskColor = (s) => (s <= 30 ? "var(--green)" : s <= 60 ? "var(--amber)" : "var(--red)");
const riskTone = (s) => (s <= 30 ? "green" : s <= 60 ? "amber" : "red");
const sevLabel = (n) => ["", "Low", "Medium", "High"][n];
const finalVal = (o) => (o.override != null ? o.override : o.ai);
function overallScore(ev, weights) { if (!ev) return null; return Math.round(DIMS.reduce((a, d) => a + (weights[d.key] / 100) * (finalVal(ev.dims[d.key]) / 5) * 100, 0)); }
const recFromScore = (s) => (s >= 85 ? "Strong Hire" : s >= 70 ? "Hire" : s >= 55 ? "Hold" : "No Hire");
const REC_TONE = { "Strong Hire": "green", Hire: "blue", Hold: "amber", "No Hire": "red" };
const fmtDate = (d, opts = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", opts);
const fmtTime = (t) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };
const fmtClock = (sec) => tsAdd(0, sec);
const tsToSec = (ts) => ts.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);
const AV_COLORS = ["#6C5CE7", "#3366F0", "#0A9DB0", "#C53D9C", "#D98A06", "#0F9D74", "#2A3D86", "#E0565B"];
const avColor = (name) => AV_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AV_COLORS.length];
const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const randToken = () => Math.random().toString(36).slice(2, 7);
function copyText(text) { try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).catch(() => {}); return true; } } catch (e) { /* ignore */ } return false; }

/* ---- Interview status derivation (date/time + attendance) ---- */
const slotStart = (iv) => new Date(`${iv.date}T${iv.time}:00`);
const slotEnd = (iv) => new Date(slotStart(iv).getTime() + iv.duration * 60000);
function deriveStatus(iv, now) {
  if (iv.status === "Cancelled" || iv.status === "In Progress" || iv.status === "Completed") return iv.status;
  if (now < slotEnd(iv)) return "Scheduled";
  return iv.joinedAt ? "Completed" : "No Show";
}
const isDueNow = (iv, now) => iv.status === "Scheduled" && now >= slotStart(iv) && now < slotEnd(iv);
const AUTO_PROFILES = [{ dims: [4, 4, 3, 4], q: [4, 4, 3, 4, 4] }, { dims: [3, 4, 4, 3], q: [3, 4, 4, 3, 3] }, { dims: [4, 3, 4, 4], q: [4, 3, 4, 4, 4] }];
const autoProfile = (id) => AUTO_PROFILES[Number(id.replace(/\D/g, "")) % AUTO_PROFILES.length];

/* ============================================================================
   MOCK AI QUESTION ENGINE (frontend only — deterministic, explainable, no API)
   Resume-based questions come from the candidate's parsed resume (skills, projects,
   experience). Follow-ups are generated from what the candidate actually said.
   ========================================================================== */
const SKILL_Q = {
  react: ["On {project}, how did you keep React rendering fast as the app grew — what did you measure and change?", "Re-render analysis, memoization trade-offs, profiling"],
  "next.js": ["Why did you choose Next.js for {project}, and how did you decide between server and client rendering?", "SSR/SSG trade-offs, caching, performance"],
  typescript: ["How did TypeScript prevent real bugs on {project}? Describe a type you designed that caught an issue.", "Type design, strictness, practical examples"],
  accessibility: ["Your resume highlights accessibility. How did you test {project} with screen readers and keyboard-only navigation?", "WCAG knowledge, assistive-tech testing, process"],
  graphql: ["How did you handle schema evolution and N+1 queries with GraphQL on {project}?", "Dataloaders, deprecation strategy, caching"],
  go: ["Why Go for {project}, and how did you handle concurrency and backpressure?", "Goroutines, channels, rate limiting, profiling"],
  kafka: ["On {project}, how did you guarantee ordering and avoid duplicate processing with Kafka?", "Partitioning, idempotent consumers, offsets"],
  postgresql: ["What PostgreSQL performance problem did you hit on {project}, and how did you diagnose it?", "EXPLAIN plans, indexing, locking"],
  aws: ["Which AWS services did {project} rely on, and how did you design for an availability-zone failure?", "Multi-AZ design, failover, cost awareness"],
  redis: ["How did you use Redis on {project}, and what happens to correctness if Redis is unavailable?", "Fail-open vs fail-closed, consistency"],
  python: ["How did you structure the Python codebase for {project} so experiments were reproducible?", "Pipelines, versioning, testing"],
  xgboost: ["Why XGBoost for {project} rather than a simpler model, and how did you prevent overfitting?", "Baselines, regularisation, validation strategy"],
  sql: ["Walk me through the most complex SQL you wrote for {project}. How did you validate the results?", "Window functions, correctness checks"],
  experimentation: ["On {project}, how did you choose sample sizes and guard against peeking?", "Power analysis, sequential testing, guardrails"],
  roadmapping: ["How did you build and defend the roadmap for {project} when stakeholders disagreed?", "Prioritisation framework, alignment, trade-offs"],
  "b2b saas": ["On {project}, how did you balance requests from your largest customers against the broader product vision?", "Customer segmentation, saying no, evidence"],
  analytics: ["Which metrics defined success for {project}, and how did you instrument them?", "North-star vs guardrails, instrumentation"],
  discovery: ["Describe the discovery process on {project}. What did you learn that changed the plan?", "Research methods, pivots based on evidence"],
  kubernetes: ["During {project}, how did you handle stateful workloads and zero-downtime rollouts on Kubernetes?", "Rollout strategies, PDBs, StatefulSets"],
  terraform: ["How did you structure Terraform state and modules across environments for {project}?", "State isolation, module design, drift"],
  observability: ["How did you choose SLOs for {project}, and how did alerting change on-call load?", "SLIs/SLOs, alert fatigue, error budgets"],
  testing: ["On {project}, how did you keep the test suite fast and trustworthy?", "Flakiness, test pyramid, CI time"],
  "node.js": ["How did you handle CPU-heavy work and the event loop in Node.js on {project}?", "Worker threads, queues, profiling"],
  "ci/cd": ["What did a deploy look like on {project}, and how did you make rollbacks safe?", "Pipelines, canaries, rollback"],
};
const PAST_TENSE_FIX = (s) => s.replace(/\.$/, "");

function projectFor(c, skill) {
  const ps = (c.resume && c.resume.projects) || [];
  return ps.find((p) => (p.tech || []).some((t) => t.toLowerCase() === skill.toLowerCase())) || ps[0];
}
function resumeQuestions(c, role) {
  const r = c.resume || { projects: [] }; const ps = r.projects || []; const out = [];
  const title = r.title || "your current role";
  out.push({ key: "open", type: "opening", text: `Tell me about yourself — walk me through your path to ${r.title ? `your role as ${r.title}` : "your current role"} at ${c.company}.`, source: `Resume · ${c.experience} yrs experience · currently ${title} at ${c.company}`, listen: "Clear narrative, relevance to this role, motivation" });
  ps.slice(0, 2).forEach((p, i) => {
    out.push({ key: `proj-${i}`, type: "resume", project: p.name, text: `Your resume says you ${PAST_TENSE_FIX(p.desc)} on "${p.name}". What was your personal role, and what was the hardest decision you made?`, source: `Resume · Project: ${p.name}`, listen: "Personal ownership, trade-offs, concrete technical detail" });
    if (p.impact) out.push({ key: `impact-${i}`, type: "resume", project: p.name, text: `You list the outcome "${PAST_TENSE_FIX(p.impact)}" for ${p.name}. How was that measured, and what was the baseline?`, source: `Resume · Impact claim on ${p.name}`, listen: "Measurement rigour, honest attribution" });
  });
  (c.skills || []).slice(0, 4).forEach((sk) => {
    const p = projectFor(c, sk); const tpl = SKILL_Q[sk.toLowerCase()];
    const text = tpl ? tpl[0].replace("{project}", p ? `"${p.name}"` : "your recent work") : `Your resume lists ${sk}. Describe a real problem you solved with ${sk}${p ? ` on "${p.name}"` : ""} and what you would do differently today.`;
    out.push({ key: `skill-${sk.toLowerCase()}`, type: "resume", skill: sk, project: p && p.name, text, source: `Resume · Skill: ${sk}${p ? ` (used in ${p.name})` : ""}`, listen: tpl ? tpl[1] : "Depth beyond buzzwords, real production example" });
  });
  out.push({ key: "align", type: "resume", text: `This role is ${role}. Which part of your experience at ${c.company} best prepares you for it, and where would you need to ramp up?`, source: `Resume vs. job role · ${role}`, listen: "Self-awareness, honest gaps, role fit" });
  return out;
}

/* Rules applied to the candidate's actual answer. Each rule quotes what triggered it. */
const TOPIC_RULES = [
  { re: /\b(cach(e|ing)|redis)\b/i, topic: "Caching", q: () => "You mentioned caching — how did you handle invalidation and stale reads?", listen: "Invalidation strategy, consistency trade-offs" },
  { re: /\b(kafka|event[- ]driven|outbox|queue)\b/i, topic: "Event-driven", q: (m) => `You brought up ${m.toLowerCase()} — how did you guarantee ordering and avoid duplicate processing?`, listen: "Idempotency, partitioning, failure handling" },
  { re: /\bmicroservices?\b/i, topic: "Microservices", q: () => "What drove the move to microservices, and what operational cost did it add?", listen: "Honest trade-offs, operational maturity" },
  { re: /\b(migrat\w*|rewrite|feature flags?|roll ?back)\b/i, topic: "Migration", q: () => "You described a migration or risky rollout — how did you de-risk it (dual writes, shadow traffic, feature flags, rollback plan)?", listen: "Risk management, incremental delivery" },
  { re: /\b(led|lead|leading|mentor\w*|managed)\b/i, topic: "Leadership", q: (m) => `You said you ${m.toLowerCase()} — how many people were involved, and how did you handle a disagreement within that group?`, listen: "Influence, conflict handling, team outcomes" },
  { re: /\b(accessib\w*|a11y|wcag|screen readers?|lighthouse)\b/i, topic: "Accessibility", q: () => "Which accessibility issue was hardest to fix, and how do you stop regressions after release?", listen: "Concrete a11y fixes, automated + manual testing" },
  { re: /\b(performance|latency|load time|slow|p9[59]|profil\w*)\b/i, topic: "Performance", q: (m) => `You mentioned ${m.toLowerCase()} — what did you profile first, and what trade-off did the fix introduce?`, listen: "Measurement before optimisation, trade-offs" },
  { re: /\b(component library|design system|tokens?)\b/i, topic: "Design systems", q: () => "How did you drive adoption of the component library across teams that didn't report to you?", listen: "Influence without authority, API design" },
  { re: /\b(tests?|testing|playwright|ci)\b/i, topic: "Testing", q: () => "How did you decide what to test at each level, and how did you deal with flaky tests?", listen: "Test strategy, pragmatism" },
  { re: /\b(react|typescript|next\.js)\b/i, topic: "Frontend stack", q: (m) => `You use ${m} heavily — how do you structure state and data fetching in a large ${m} codebase?`, listen: "Architecture judgement, scalability" },
  { re: /\b(aws|kubernetes|terraform|cloud|eks)\b/i, topic: "Infrastructure", q: (m) => `You mentioned ${m} — how did you manage cost and failure scenarios there?`, listen: "Reliability and cost awareness" },
  { re: /\b(model|xgboost|churn|features?|overfit\w*)\b/i, topic: "Modelling", q: () => "How did you validate the model before it reached production, and how do you monitor drift?", listen: "Validation design, monitoring" },
  { re: /\b(a\/b|experiment\w*|p-value|sample size)\b/i, topic: "Experimentation", q: () => "If that experiment had come back flat, what would you have recommended next?", listen: "Decision-making under uncertainty" },
  { re: /\b(customers?|users?|clinics?|merchants?)\b/i, topic: "Customer focus", q: (m) => `You referred to ${m.toLowerCase()} — how did you gather their feedback, and what changed because of it?`, listen: "Evidence-based decisions" },
  { re: /\b(stakeholders?|prioriti\w*|roadmap)\b/i, topic: "Prioritisation", q: () => "Tell me about a time you had to say no to a stakeholder — how did you handle it?", listen: "Transparent trade-offs, communication" },
  { re: /\b(incident|outage|on-call|downtime)\b/i, topic: "Incidents", q: () => "Walk me through the worst incident you handled — what did the post-mortem change?", listen: "Calm under pressure, systemic fixes" },
  { re: /\b(deadline|pressure|tight timeline)\b/i, topic: "Delivery pressure", q: () => "How did you decide what to cut to hit that deadline, and who did you involve?", listen: "Scope negotiation" },
];
const METRIC_RE = /\b\d+(?:\.\d+)?\s?(?:%|x\b|ms\b|k\b|minutes|hours|days|million|users|engineers|teams|services|requests per second)/i;

function snippetAround(text, idx, len) {
  let a = Math.max(0, idx - 45); let b = Math.min(text.length, idx + len + 40);
  while (a > 0 && text[a - 1] !== " ") a--;
  while (b < text.length && text[b] !== " ") b++;
  return `${a > 0 ? "…" : ""}${text.slice(a, b).trim()}${b < text.length ? "…" : ""}`;
}

function analyzeAnswer(answer, question, c, orgShort) {
  const text = (answer || "").trim();
  const words = text ? text.split(/\s+/).length : 0;
  const iCount = (text.match(/\b(I|I'm|I've|my|me)\b/g) || []).length;
  const weCount = (text.match(/\b(we|we're|we've|our|us)\b/gi) || []).length;
  const ups = []; const topics = []; const metrics = [];
  const pk = question.key;
  const add = (kind, q, reason, listen) => { if (!ups.some((u) => u.text === q)) ups.push({ key: `fu-${pk}-${kind}-${ups.length}`, type: "followup", kind, parent: pk, text: q, source: `Follow-up to: “${question.text.slice(0, 60)}${question.text.length > 60 ? "…" : ""}”`, reason, listen }); };

  const mm = text.match(METRIC_RE);
  if (mm) { metrics.push(mm[0]); add("metric", `You mentioned "${mm[0].trim()}" — how was that measured, and what was the baseline before your change?`, `Candidate said: ${snippetAround(text, mm.index, mm[0].length)}`, "Measurement rigour, attribution"); }
  ((c.resume && c.resume.projects) || []).forEach((p) => {
    const i = text.toLowerCase().indexOf(p.name.toLowerCase());
    if (i >= 0 && question.project !== p.name && !ups.some((u) => u.kind === "project")) add("project", `You brought up "${p.name}". What was the single hardest technical problem on that project, and how did you solve it?`, `Candidate referenced resume project: ${snippetAround(text, i, p.name.length)}`, "Depth on a project they chose to highlight");
  });
  if (/\b(looking for|next role|why (this|i applied)|interested in)\b/i.test(text) || question.type === "opening") add("motivation", `What specifically attracted you to this role at ${orgShort}, and what would make you leave ${c.company}?`, question.type === "opening" ? "Opening answer — motivation not yet explored" : "Candidate talked about what they're looking for", "Genuine motivation, alignment");
  TOPIC_RULES.forEach((r) => {
    const m = text.match(r.re);
    if (m && !topics.includes(r.topic)) { topics.push(r.topic); if (topics.length <= 3) add("topic", r.q(m[0]), `Candidate said: ${snippetAround(text, m.index, m[0].length)}`, r.listen); }
  });
  if (weCount >= 3 && weCount > iCount * 1.5) add("ownership", "You said \"we\" quite a lot — which parts did you personally design, build or decide?", `Ownership signal: “we/our” ×${weCount} vs “I/my” ×${iCount}`, "Clear individual contribution");
  if (words > 0 && words < 30) add("depth", "Could you walk me through one specific example of that, step by step?", `Answer was brief (${words} words)`, "Concrete specifics");
  if (words >= 30 && !mm) add("impact", "What measurable impact did that have? Any numbers you can share?", "No metrics mentioned in the answer", "Outcome orientation");

  const depth = words < 30 ? "Brief" : words < 70 ? "Moderate" : "Detailed";
  return { topics, metrics, words, iCount, weCount, depth, followUps: ups.slice(0, 5), at: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) };
}

/* Simulated live transcript capture — builds a realistic answer from the resume / question context. */
function simulateAnswer(q, c, role, orgShort) {
  const ps = (c.resume && c.resume.projects) || []; const p0 = ps[0]; const p1 = ps[1];
  const pick = (name) => ps.find((p) => p.name === name) || p0;
  const impact = (p) => (p && p.impact ? `, which ${PAST_TENSE_FIX(p.impact)}` : "");
  if (q.type === "opening") return `I'm a ${(c.resume && c.resume.title) || "software professional"} at ${c.company} with about ${c.experience} years of experience, mostly working with ${c.skills.slice(0, 3).join(", ")}. ${p0 ? `Most recently I led the ${p0.name} project, where I ${PAST_TENSE_FIX(p0.desc)}${impact(p0)}.` : ""} ${p1 ? `Before that I worked on the ${p1.name} project.` : ""} I'm now looking for a role where I can own bigger problems end to end, which is why this ${role} position interested me.`.replace(/\s+/g, " ");
  if (q.key.startsWith("proj-")) { const p = pick(q.project); return `On ${p.name} I was the lead engineer. We ${PAST_TENSE_FIX(p.desc)}. The hardest decision was whether to do a big-bang rewrite or migrate incrementally — I pushed for an incremental migration behind feature flags so we could roll back at any point. It took longer, but there were no customer-facing incidents, and in the end it ${PAST_TENSE_FIX(p.impact || "met its goals")}.`; }
  if (q.key.startsWith("impact-")) { const p = pick(q.project); return `We set up dashboards two weeks before the change to get a baseline, then compared the same period after launch. The result was that it ${PAST_TENSE_FIX(p.impact)}. I also checked that guardrail metrics like error rate didn't get worse.`; }
  if (q.key.startsWith("skill-")) { const p = pick(q.project); return `I've used ${q.skill} for most of my career, most heavily on ${p ? p.name : "my current team"}. One real problem was a performance regression after a release — I profiled it, found unnecessary work happening on every request, fixed it and added a check in CI. That cut p95 latency by about 30%.`; }
  if (q.key === "align") return `At ${c.company} I worked on ${p0 ? p0.name : "core product features"}, which is close to what this team does. Where I'd need to ramp up is your internal tooling and domain, but I've done that before within my first month.`;
  if (q.type === "bank") { const lib = Object.values(QA_LIB).flat().find((x) => x.qid === q.bankId); return lib ? lib.answer : "I'd start by clarifying the requirements and constraints, then propose a simple design, measure it, and iterate."; }
  if (q.kind === "metric") return "We tracked it in our monitoring dashboards. The baseline was the average of the four weeks before release, and we confirmed the improvement held for a month afterwards, so it wasn't a novelty effect.";
  if (q.kind === "ownership") return "I personally designed the approach and wrote the first version of the core service; two teammates handled testing and rollout, and I reviewed every change that touched the critical path.";
  if (q.kind === "motivation") return `I want more ownership and to work on a product where fairness really matters — ${orgShort} building AI for hiring is exactly that. I've learned a lot at ${c.company}, but the scope there has become narrow.`;
  return "We started simple, measured, and only added complexity where the data showed we needed it. For example, we added a cache only after profiling showed the database was the bottleneck, and we invalidated it on every write.";
}
const QTYPE_META = { opening: ["Resume · Opening", "purple"], resume: ["Resume-based", "purple"], followup: ["AI follow-up", "blue"], bank: ["Question bank", "navy"] };

/* Minimal client-side PDF writer (Helvetica, text only) — used for the mock "Download PDF" */
function buildPdf(blocks) {
  const ascii = (t) => String(t).replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[•·]/g, "-").replace(/→/g, "->").replace(/[^\x20-\x7E]/g, "");
  const esc = (t) => t.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const wrap = (t, max) => { const words = t.split(" "); const out = []; let line = ""; words.forEach((w) => { if ((line + " " + w).trim().length > max) { if (line) out.push(line); line = w; } else line = (line + " " + w).trim(); }); if (line) out.push(line); return out.length ? out : [""]; };
  const pages = []; let cur = []; let y = 790;
  blocks.forEach((b) => {
    const size = b.size || 10; const indent = b.indent || 0; const max = Math.floor((495 - indent) / (size * 0.5));
    const col = b.color || "0.055 0.09 0.2";
    if (b.space) y -= b.space;
    wrap(ascii(b.text || ""), max).forEach((l) => {
      if (y < 60) { pages.push(cur); cur = []; y = 790; }
      cur.push(`BT /${b.bold ? "F2" : "F1"} ${size} Tf ${col} rg ${50 + indent} ${y} Td (${esc(l)}) Tj ET`);
      y -= size + 4.5;
    });
    if (b.rule) { cur.push(`0.85 0.87 0.93 RG 0.8 w 50 ${y + 6} m 545 ${y + 6} l S`); y -= 8; }
  });
  pages.push(cur);
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  const kids = [];
  pages.forEach((p, i) => {
    const content = p.join("\n") + `\nBT /F1 8 Tf 0.5 0.53 0.62 rg 50 30 Td (Credang AI - Confidential scorecard - AI-assisted draft reviewed by a human interviewer - Page ${i + 1} of ${pages.length}) Tj ET`;
    objs.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    const cNum = objs.length;
    objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${cNum} 0 R >>`);
    kids.push(`${objs.length} 0 R`);
  });
  objs[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${kids.length} >>`;
  let out = "%PDF-1.4\n"; const offs = [];
  objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("") + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out], { type: "application/pdf" });
}
function downloadBlob(blob, filename) {
  try { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); return true; } catch (e) { return false; }
}

/* ============================================================================
   REUSABLE UI COMPONENTS
   ========================================================================== */
function Btn({ variant = "primary", size, icon, iconRight, children, className = "", ...p }) {
  return (
    <button className={`btn btn-${variant} ${size ? "btn-" + size : ""} ${className}`} {...p}>
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 14 : 16} />}
    </button>
  );
}
const Badge = ({ tone = "gray", dot, pulse, children, style }) => <span className={`badge b-${tone}`} style={style}>{dot && <i className={`bdot ${pulse ? "pulse" : ""}`} />}{children}</span>;
const STATUS_TONE = { Scheduled: "blue", "In Progress": "purple", Completed: "green", "No Show": "amber", Cancelled: "gray" };
const StatusBadge = ({ status }) => <Badge tone={STATUS_TONE[status]} dot pulse={status === "In Progress"}>{status}</Badge>;
const RiskBadge = ({ score, showScore = true }) => <Badge tone={riskTone(score)}><Icon name="shield" size={12} />{riskLevel(score)}{showScore ? ` · ${score}` : ""}</Badge>;
const RecBadge = ({ rec, prefix }) => rec ? <Badge tone={REC_TONE[rec]}>{prefix}{rec}</Badge> : <Badge tone="gray">Pending</Badge>;
function Avatar({ name, size = 34 }) { return <div className="avatar" style={{ width: size, height: size, background: avColor(name), fontSize: size * 0.36 }}>{initials(name)}</div>; }
function Person({ name, sub, size }) { return <div className="person"><Avatar name={name} size={size} /><div style={{ minWidth: 0 }}><div className="person-name ellipsis">{name}</div>{sub && <div className="person-sub ellipsis">{sub}</div>}</div></div>; }

function Card({ title, subtitle, icon, actions, children, className = "", bodyClass = "card-body", noBody, style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {(title || actions) && (
        <div className="card-head">
          <div style={{ minWidth: 0 }}>
            <div className="card-title">{icon && <Icon name={icon} size={17} style={{ color: "var(--purple)" }} />}{title}</div>
            {subtitle && <div className="card-sub">{subtitle}</div>}
          </div>
          {actions && <div className="row">{actions}</div>}
        </div>
      )}
      {noBody ? children : <div className={bodyClass}>{children}</div>}
    </div>
  );
}

function Modal({ open, onClose, title, subtitle, children, footer, width = 560 }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-ov" onMouseDown={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div className="modal" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div><div className="modal-title">{title}</div>{subtitle && <div className="small muted" style={{ marginTop: 2 }}>{subtitle}</div>}</div>
          <button className="icon-act" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, error, hint, children, style }) {
  return <div className="field" style={style}>{label && <label>{label}</label>}{children}{error ? <span className="err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}</div>;
}
function Toggle({ checked, onChange, disabled, label }) { return <button type="button" className={`toggle ${checked ? "on" : ""}`} onClick={() => !disabled && onChange(!checked)} disabled={disabled} aria-pressed={checked} aria-label={label} />; }
function SetRow({ title, desc, children }) { return <div className="set-row"><div><div className="set-title">{title}</div>{desc && <div className="set-desc">{desc}</div>}</div><div className="row">{children}</div></div>; }
function Tabs({ tabs, value, onChange }) {
  return <div className="tabs">{tabs.map((t) => <button key={t.key} className={`tab ${value === t.key ? "active" : ""}`} onClick={() => onChange(t.key)}>{t.icon && <Icon name={t.icon} size={15} />}{t.label}{t.count != null && <span className="badge b-gray" style={{ padding: "0 7px" }}>{t.count}</span>}</button>)}</div>;
}
function EmptyState({ icon = "search", title, text, action }) { return <div className="empty"><div className="ei"><Icon name={icon} size={24} /></div><h4>{title}</h4><div className="small">{text}</div>{action && <div className="mt-16">{action}</div>}</div>; }
function SearchBox({ value, onChange, placeholder }) { return <div className="searchbox"><Icon name="search" size={16} className="ic" /><input className="inp inp-sm" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>; }
function Dots({ value, max = 5 }) { return <span className="dots">{Array.from({ length: max }).map((_, i) => <i key={i} className={i < value ? "on" : ""} />)}</span>; }
function ScorePill({ value, max = 5 }) { const pct = value / max; const c = pct >= 0.8 ? ["var(--green-50)", "var(--green)"] : pct >= 0.6 ? ["var(--blue-50)", "var(--blue)"] : pct >= 0.4 ? ["var(--amber-50)", "var(--amber)"] : ["var(--red-50)", "var(--red)"]; return <span className="score-pill" style={{ background: c[0], color: c[1] }}>{value}{max === 5 ? "/5" : ""}</span>; }
function ProgressBar({ value, color = "var(--purple)" }) { return <div className="bar"><div style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} /></div>; }
function MonitoringIndicator({ active = true, label }) { return active ? <span className="mon-ind"><span className="rec-dot" />{label || "Monitoring active"}</span> : <Badge tone="gray"><Icon name="eyeOff" size={12} />Monitoring off</Badge>; }

/* ---- Charts ---- */
function Gauge({ value, size = 220, label = true }) {
  const r = 80, cx = 100, cy = 95;
  const pt = (deg) => [cx + r * Math.cos((Math.PI * deg) / 180), cy - r * Math.sin((Math.PI * deg) / 180)];
  const arc = (from, to) => { const a = pt(from), b = pt(to); return `M ${a[0]} ${a[1]} A ${r} ${r} 0 0 1 ${b[0]} ${b[1]}`; };
  const ang = 180 - (180 * Math.max(0.5, value)) / 100;
  const n = pt(ang);
  return (
    <div style={{ width: size, margin: "0 auto", textAlign: "center" }}>
      <svg viewBox="0 0 200 120" width="100%">
        <path d={arc(180, 126)} stroke="#CDEFE3" strokeWidth="16" fill="none" />
        <path d={arc(124.2, 72)} stroke="#F8E3BA" strokeWidth="16" fill="none" />
        <path d={arc(70.2, 0)} stroke="#F7CFD3" strokeWidth="16" fill="none" />
        <path d={arc(180, ang)} stroke={riskColor(value)} strokeWidth="16" fill="none" strokeLinecap="round" style={{ transition: "all .6s" }} />
        <circle cx={n[0]} cy={n[1]} r="7" fill="#fff" stroke={riskColor(value)} strokeWidth="3" />
        <text x="100" y="88" textAnchor="middle" fontSize="34" fontWeight="800" fill="var(--text)">{value}</text>
        <text x="100" y="108" textAnchor="middle" fontSize="11" fill="var(--muted)" fontWeight="600" letterSpacing="1">RISK SCORE</text>
        <text x="20" y="116" fontSize="9" fill="var(--faint)">0</text><text x="174" y="116" fontSize="9" fill="var(--faint)">100</text>
      </svg>
      {label && <Badge tone={riskTone(value)} style={{ fontSize: 12.5, padding: "4px 12px" }}><Icon name="shield" size={13} />{riskLevel(value)} RISK</Badge>}
    </div>
  );
}

function ScoreRing({ value, size = 110, stroke = 10, color, sub = "/ 100", dark }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  const c = color || (value >= 85 ? "#0F9D74" : value >= 70 ? "#3366F0" : value >= 55 ? "#D98A06" : "#DC3D4B");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? "rgba(255,255,255,.15)" : "#EDF0F7"} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(C * (value || 0)) / 100} ${C}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dasharray .6s" }} />
      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.27} fontWeight="800" fill={dark ? "#fff" : "var(--text)"}>{value ?? "—"}</text>
      <text x="50%" y="68%" textAnchor="middle" fontSize={size * 0.1} fill={dark ? "rgba(255,255,255,.7)" : "var(--muted)"}>{sub}</text>
    </svg>
  );
}

function ActivityChart({ labels, conducted, flagged }) {
  const [hover, setHover] = useState(null);
  const W = 640, H = 240, P = { l: 34, r: 14, t: 16, b: 30 };
  const max = Math.ceil(Math.max(...conducted) / 5) * 5 + 5;
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const x = (i) => P.l + (i * iw) / (labels.length - 1);
  const y = (v) => P.t + ih - (v / max) * ih;
  const line = conducted.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L ${x(labels.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max].map((v) => Math.round(v));
  return (
    <div className="chart-wrap" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <defs><linearGradient id="chg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6C5CE7" stopOpacity=".28" /><stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" /></linearGradient></defs>
        {ticks.map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#EDF0F7" strokeDasharray={t ? "4 4" : ""} /><text x={P.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#9AA2BC">{t}</text></g>)}
        {flagged.map((v, i) => <rect key={i} x={x(i) - 9} y={y(v)} width="18" height={y(0) - y(v)} rx="4" fill="#DC3D4B" opacity={hover === i ? 0.95 : 0.7} />)}
        <path d={area} fill="url(#chg)" />
        <path d={line} fill="none" stroke="#6C5CE7" strokeWidth="2.6" strokeLinejoin="round" />
        {conducted.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5.5 : 3.5} fill="#fff" stroke="#6C5CE7" strokeWidth="2.4" />)}
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={y(0)} stroke="#6C5CE7" strokeOpacity=".3" />}
        {labels.map((l, i) => <text key={l} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#9AA2BC">{l}</text>)}
        {labels.map((l, i) => <rect key={"h" + i} x={x(i) - iw / labels.length / 2} y={P.t} width={iw / labels.length} height={ih} fill="transparent" onMouseEnter={() => setHover(i)} />)}
      </svg>
      {hover != null && (
        <div className="chart-tip" style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(conducted[hover]) / H) * 100}%` }}>
          <div style={{ fontWeight: 700, marginBottom: 3 }}>Week of {labels[hover]}</div>
          <div>● {conducted[hover]} interviews conducted</div>
          <div style={{ color: "#FF9BA5" }}>● {flagged[hover]} flagged for review</div>
        </div>
      )}
    </div>
  );
}

function Donut({ segments, size = 150, center, sub }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1; const r = 54, C = 2 * Math.PI * r; let acc = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#EDF0F7" strokeWidth="16" />
      {segments.map((s) => { const len = (s.value / total) * C; const el = <circle key={s.label} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="16" strokeDasharray={`${Math.max(0, len - 2)} ${C}`} strokeDashoffset={-acc} transform="rotate(-90 70 70)" />; acc += len; return el; })}
      <text x="70" y="68" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--text)">{center}</text>
      <text x="70" y="86" textAnchor="middle" fontSize="10.5" fill="var(--muted)">{sub}</text>
    </svg>
  );
}

function StatCard({ icon, label, value, foot, tone = "purple", onClick, footTone }) {
  const tones = { purple: ["var(--purple-50)", "var(--purple)"], blue: ["var(--blue-50)", "var(--blue)"], green: ["var(--green-50)", "var(--green)"], red: ["var(--red-50)", "var(--red)"], amber: ["var(--amber-50)", "var(--amber)"], navy: ["#E6E9F5", "var(--navy-700)"] };
  return (
    <div className="card stat" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick && onClick()}>
      <div className="stat-icon" style={{ background: tones[tone][0], color: tones[tone][1] }}><Icon name={icon} size={20} /></div>
      <Icon name="arrowUpRight" size={16} className="stat-go" />
      <div className="stat-val">{value}</div>
      <div className="stat-label">{label}</div>
      {foot && <div className="stat-foot" style={{ color: footTone }}>{foot}</div>}
    </div>
  );
}

/* ============================================================================
   PAGE: DASHBOARD
   ========================================================================== */
function DashboardPage({ interviews, events, evals, weights, go, live, users, now, org }) {
  const riskOf = (id) => computeRisk(events.filter((e) => e.iid === id));
  const completed = interviews.filter((i) => i.status === "Completed");
  const upcoming = interviews.filter((i) => i.status === "Scheduled");
  const flagged = interviews.filter((i) => i.status !== "Cancelled" && riskOf(i.id) > 30);
  const scores = completed.map((i) => overallScore(evals[i.id], weights)).filter((s) => s != null);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const todays = interviews.filter((i) => i.date === TODAY && i.status !== "Cancelled").sort((a, b) => a.time.localeCompare(b.time));
  const recent = [...interviews].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).slice(0, 6);
  const alerts = events.filter((e) => e.status === "active" && e.sev >= 2).map((e) => ({ ...e, iv: interviews.find((i) => i.id === e.iid) })).filter((e) => e.iv)
    .sort((a, b) => (b.iv.date + b.ts).localeCompare(a.iv.date + a.ts)).slice(0, 6);
  const dist = { LOW: 0, MEDIUM: 0, HIGH: 0 }; completed.forEach((i) => dist[riskLevel(riskOf(i.id))]++);
  const pending = completed.filter((i) => evals[i.id] && !evals[i.id].signedOff).length;
  const noShows = interviews.filter((i) => i.status === "No Show").length;
  const laterToday = todays.filter((t) => t.status === "Scheduled" && now < slotStart(t)).length;

  return (
    <>
      <div className="ch-page-head">
        <div><div className="ch-crumb">Overview</div><h1 className="ch-page-title">{greetingFor(now)}, {ADMIN_FIRST}</h1><div className="ch-page-sub">{org.shortName} · {fmtDate(TODAY, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {todays.length} interviews today · {pending} scorecards awaiting your review</div></div>
        <div className="row wrap"><Btn variant="secondary" icon="file" onClick={() => go("reports")}>View reports</Btn><Btn icon="plus" onClick={() => go("interviews", { openNew: true })}>Schedule interview</Btn></div>
      </div>

      {live.status === "running" && (
        <div className="banner danger mb-16" style={{ alignItems: "center" }}>
          <span className="rec-dot" /><div style={{ flex: 1 }}><b>Live interview in progress</b> — {interviews.find((i) => i.id === live.iid)?.candidate.name} · {fmtClock(live.elapsed)} elapsed · live risk {riskOf(live.iid)}</div>
          <Btn size="sm" variant="danger" icon="video" onClick={() => go("room", { roomId: live.iid })}>Return to room</Btn>
        </div>
      )}

      <div className="grid g-5 mb-16">
        <StatCard icon="layers" label="Total Interviews" value={interviews.length} tone="navy" foot={<><Icon name="trend" size={13} /> +18% vs last month</>} footTone="var(--green)" onClick={() => go("interviews", { statusFilter: "All" })} />
        <StatCard icon="calendar" label="Upcoming Interviews" value={upcoming.length} tone="blue" foot={`${laterToday} later today`} onClick={() => go("interviews", { statusFilter: "Scheduled" })} />
        <StatCard icon="check" label="Completed Interviews" value={completed.length} tone="green" foot={`${pending} pending sign-off · ${noShows} no-show${noShows === 1 ? "" : "s"}`} onClick={() => go("interviews", { statusFilter: "Completed" })} />
        <StatCard icon="flag" label="Flagged Interviews" value={flagged.length} tone="red" foot="Medium or high integrity risk" footTone="var(--red)" onClick={() => go("integrity", { integrityId: flagged[0]?.id })} />
        <StatCard icon="star" label="Avg. Candidate Score" value={<>{avg}<span style={{ fontSize: 15, color: "var(--muted)", fontWeight: 600 }}> / 100</span></>} tone="purple" foot="Weighted rubric score" onClick={() => go("reports")} />
      </div>

      <div className="grid g-main mb-16">
        <Card title="Interview Activity" subtitle="Weekly interviews conducted vs. flagged for integrity review" icon="trend"
          actions={<div className="legend"><span><i style={{ background: "#6C5CE7" }} />Conducted</span><span><i style={{ background: "#DC3D4B" }} />Flagged</span></div>}>
          <ActivityChart {...ACTIVITY} />
        </Card>
        <Card title="Today's Schedule" subtitle={fmtDate(TODAY)} icon="clock" noBody>
          {todays.length === 0 ? <EmptyState icon="calendar" title="No interviews today" text="Enjoy the quiet — or schedule one." /> : todays.map((iv) => (
            <div key={iv.id} className="list-item" onClick={() => (iv.status === "Completed" && !(live.iid === iv.id && live.status !== "idle") ? go("evaluation", { evalId: iv.id }) : iv.status === "No Show" ? go("interviews", { viewId: iv.id }) : go("room", { roomId: iv.id }))}>
              <div style={{ textAlign: "center", minWidth: 54 }}><div className="bold">{fmtTime(iv.time)}</div><div className="xs muted">{iv.duration} min</div></div>
              <div style={{ flex: 1, minWidth: 0 }}><div className="bold ellipsis">{iv.candidate.name}</div><div className="small muted ellipsis">{iv.role} · with {userById(iv.interviewer, users).name}</div></div>
              {live.iid === iv.id && live.status === "running" ? <Badge tone="red" dot pulse>Live</Badge> : iv.status !== "Scheduled" ? <StatusBadge status={iv.status} /> : isDueNow(iv, now) ? <Btn size="sm" icon="video">Join now</Btn> : <Btn size="sm" variant="secondary" icon="video">Join</Btn>}
            </div>
          ))}
          <div style={{ padding: 16, borderTop: "1px solid var(--border-2)" }}>
            <div className="section-title">Integrity risk distribution</div>
            <div className="row" style={{ gap: 18 }}>
              <Donut size={112} center={completed.length} sub="completed" segments={[{ label: "LOW", value: dist.LOW, color: "#0F9D74" }, { label: "MEDIUM", value: dist.MEDIUM, color: "#D98A06" }, { label: "HIGH", value: dist.HIGH, color: "#DC3D4B" }]} />
              <div className="col" style={{ gap: 8, flex: 1 }}>
                {[["LOW", "0–30", "#0F9D74"], ["MEDIUM", "31–60", "#D98A06"], ["HIGH", "61–100", "#DC3D4B"]].map(([l, r, c]) => (
                  <div key={l} className="row between small"><span className="row" style={{ gap: 7 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: c, display: "block" }} />{l} <span className="faint">({r})</span></span><b>{dist[l]}</b></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid g-main">
        <Card title="Recent Interviews" icon="calendar" noBody actions={<Btn size="sm" variant="ghost" iconRight="arrowRight" onClick={() => go("interviews")}>View all</Btn>}>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Candidate</th><th>Role</th><th>Date</th><th>Status</th><th>Integrity</th><th>Score</th></tr></thead><tbody>
            {recent.map((iv) => {
              const r = riskOf(iv.id); const sc = overallScore(evals[iv.id], weights); const hasRisk = iv.status === "Completed" || (live.iid === iv.id && live.status !== "idle");
              return (
                <tr key={iv.id} className="click" onClick={() => iv.status === "Completed" && evals[iv.id] ? go("evaluation", { evalId: iv.id }) : go("interviews", { viewId: iv.id })}>
                  <td><Person name={iv.candidate.name} sub={iv.id} size={30} /></td>
                  <td className="small">{iv.role}</td>
                  <td className="small">{fmtDate(iv.date, { day: "numeric", month: "short" })}, {fmtTime(iv.time)}</td>
                  <td><StatusBadge status={iv.status} /></td>
                  <td>{hasRisk ? <RiskBadge score={r} /> : <span className="faint">—</span>}</td>
                  <td>{sc != null ? <b>{sc}</b> : <span className="faint">—</span>}</td>
                </tr>
              );
            })}
          </tbody></table></div>
        </Card>
        <Card title="Integrity Alerts" subtitle="Simulated signals needing human review" icon="alert" noBody actions={<Btn size="sm" variant="ghost" iconRight="arrowRight" onClick={() => go("integrity")}>Monitor</Btn>}>
          {alerts.length === 0 ? <EmptyState icon="shieldCheck" title="No open alerts" text="All integrity flags have been reviewed." /> : alerts.map((a) => {
            const F = FAMILIES[a.family];
            return (
              <div key={a.id} className="list-item" onClick={() => go("integrity", { integrityId: a.iid, eventId: a.id })}>
                <div className="fam-ic" style={{ background: F.bg, color: F.color }}><Icon name={F.icon} size={16} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row between"><span className="bold small">{a.signal}</span><Badge tone={a.sev === 3 ? "red" : "amber"}>{sevLabel(a.sev)}</Badge></div>
                  <div className="small muted ellipsis">{a.iv.candidate.name} · {a.ts} · {Math.round(a.conf * 100)}% conf.</div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
}

/* ============================================================================
   PAGE: INTERVIEW MANAGEMENT
   ========================================================================== */
function parseResume(f) {
  const projects = (f.highlights || "").split("\n").map((l) => l.trim()).filter((l) => l.length > 3).slice(0, 4).map((l) => {
    const ci = l.indexOf(":"); const name = ci > 0 && ci < 60 ? l.slice(0, ci).trim() : l.split(" ").slice(0, 4).join(" ");
    const rest = ci > 0 && ci < 60 ? l.slice(ci + 1).trim() : l;
    const [desc, impact] = rest.split(/\s+[—–-]\s+/);
    return P(name, (desc || rest).trim(), (impact || "").trim(), []);
  });
  return RES(f.resumeFile || null, (f.currentTitle || "").trim(), "", projects);
}
const EMPTY_FORM = { name: "", email: "", phone: "", location: "", experience: "", company: "", skills: "", role: "", interviewer: "", date: TODAY, time: "16:00", duration: 60, notes: "", currentTitle: "", resumeFile: "", highlights: "" };

function InterviewForm({ initial, onSubmit, onCancel, users, submitLabel }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState({});
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const interviewers = users.filter((u) => u.role !== "Recruiter" && u.status === "Active");
  const onResume = (file) => {
    if (!file) return;
    set("resumeFile", file.name);
    if (/\.(txt|md)$/i.test(file.name)) {
      try { const r = new FileReader(); r.onload = () => setF((p) => ({ ...p, highlights: (p.highlights ? p.highlights + "\n" : "") + String(r.result).slice(0, 2000) })); r.readAsText(file); } catch (e) { /* ignore */ }
    }
  };
  const submit = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Candidate name is required";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address";
    if (!f.role) e.role = "Select a job role";
    if (!f.interviewer) e.interviewer = "Assign an interviewer";
    if (!f.date) e.date = "Pick a date";
    if (!f.time) e.time = "Pick a time";
    if (f.date && f.date < TODAY) e.date = "Date cannot be in the past";
    else if (f.date && f.time && new Date(`${f.date}T${f.time}:00`) < new Date()) e.time = "This time has already passed";
    setErr(e);
    if (Object.keys(e).length === 0) onSubmit(f);
  };
  return (
    <>
      <div className="section-title">Candidate details</div>
      <div className="grid g-2" style={{ gap: "0 14px" }}>
        <Field label="Full name *" error={err.name}><input className={`inp ${err.name ? "invalid" : ""}`} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Aisha Khan" /></Field>
        <Field label="Email *" error={err.email}><input className={`inp ${err.email ? "invalid" : ""}`} value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="name@email.com" /></Field>
        <Field label="Phone"><input className="inp" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 …" /></Field>
        <Field label="Location"><input className="inp" value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" /></Field>
        <Field label="Experience (years)"><input className="inp" type="number" min="0" value={f.experience} onChange={(e) => set("experience", e.target.value)} /></Field>
        <Field label="Current company"><input className="inp" value={f.company} onChange={(e) => set("company", e.target.value)} /></Field>
      </div>
      <Field label="Key skills" hint="Comma separated — used by the AI to generate resume-based questions"><input className="inp" value={f.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, TypeScript, AWS" /></Field>
      <div className="grid g-2" style={{ gap: "0 14px" }}>
        <Field label="Current job title"><input className="inp" value={f.currentTitle} onChange={(e) => set("currentTitle", e.target.value)} placeholder="e.g. Senior Frontend Engineer" /></Field>
        <Field label="Resume" hint={f.resumeFile ? `Attached: ${f.resumeFile}` : "PDF, DOCX or TXT (TXT text is extracted in this prototype)"}><input className="inp" style={{ paddingTop: 8 }} type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={(e) => onResume(e.target.files && e.target.files[0])} /></Field>
      </div>
      <Field label="Resume highlights — projects & experience" hint="One project per line: Project name: what you did — outcome. Used to generate resume-based interview questions."><textarea className="inp" value={f.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"Checkout redesign: rebuilt the checkout flow in React — raised conversion by 6%"} /></Field>
      <div className="divider" />
      <div className="section-title">Interview details</div>
      <div className="grid g-2" style={{ gap: "0 14px" }}>
        <Field label="Job role *" error={err.role}><select className={`inp ${err.role ? "invalid" : ""}`} value={f.role} onChange={(e) => set("role", e.target.value)}><option value="">Select role…</option>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></Field>
        <Field label="Interviewer *" error={err.interviewer}><select className={`inp ${err.interviewer ? "invalid" : ""}`} value={f.interviewer} onChange={(e) => set("interviewer", e.target.value)}><option value="">Assign interviewer…</option>{interviewers.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.title}</option>)}</select></Field>
        <Field label="Date *" error={err.date}><input className={`inp ${err.date ? "invalid" : ""}`} type="date" min={TODAY} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Time *" error={err.time}><input className={`inp ${err.time ? "invalid" : ""}`} type="time" value={f.time} onChange={(e) => set("time", e.target.value)} /></Field>
        <Field label="Duration"><select className="inp" value={f.duration} onChange={(e) => set("duration", Number(e.target.value))}>{[30, 45, 60, 90].map((d) => <option key={d} value={d}>{d} minutes</option>)}</select></Field>
        <Field label="Question set"><select className="inp" disabled value={f.role ? roleSet(f.role) : ""}><option value="">Auto-selected by role</option><option value="eng">Engineering core (5 questions)</option><option value="data">Data Science core (5 questions)</option><option value="pm">Product core (5 questions)</option></select></Field>
      </div>
      <Field label="Notes for interviewer"><textarea className="inp" value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Focus areas, context from recruiter screen…" /></Field>
      <div className="banner info"><Icon name="shieldCheck" size={18} /><div>The candidate will be asked to <b>accept monitoring consent</b> before joining. Integrity signals assist the interviewer — they never reject a candidate automatically.</div></div>
      <div className="row mt-20" style={{ justifyContent: "flex-end" }}><Btn variant="secondary" onClick={onCancel}>Cancel</Btn><Btn icon="check" onClick={submit}>{submitLabel}</Btn></div>
    </>
  );
}

function attendanceLabel(iv, now) {
  if (iv.status === "Cancelled") return <span className="muted">—</span>;
  if (iv.status === "No Show") return <Badge tone="amber"><Icon name="alert" size={12} />Did not join · no check-in recorded</Badge>;
  if (iv.status === "Completed" || iv.status === "In Progress") return <Badge tone="green"><Icon name="check" size={12} />Joined{iv.joinedAt ? ` at ${fmtTime(iv.joinedAt)}` : ""} via secure link</Badge>;
  if (iv.joinedAt && isDueNow(iv, now)) return <Badge tone="green"><Icon name="check" size={12} />Checked in · waiting room</Badge>;
  return <span className="muted">Not joined yet</span>;
}
function ResumeSummary({ resume }) {
  if (!resume || (!resume.file && !(resume.projects || []).length)) return <div className="small muted mt-12">No resume uploaded.</div>;
  return (
    <div className="mt-12">
      <div className="row between mb-12" style={{ marginBottom: 8 }}><span className="section-title" style={{ margin: 0 }}>Resume</span>{resume.file && <span className="tag"><Icon name="file" size={11} style={{ verticalAlign: -1, marginRight: 4 }} />{resume.file}</span>}</div>
      {resume.title && <div className="small bold">{resume.title}</div>}
      {(resume.projects || []).map((p) => <div key={p.name} className="small mt-8"><b>{p.name}</b><div className="muted">{p.desc}{p.impact ? ` — ${p.impact}` : ""}</div></div>)}
    </div>
  );
}

function InterviewsPage({ interviews, setInterviews, events, evals, weights, go, notify, confirm, ctx, users, live, now, org }) {
  const [search, setSearch] = useState(ctx.search || "");
  const [status, setStatus] = useState(ctx.statusFilter || "All");
  const [role, setRole] = useState("All");
  const [interviewer, setInterviewer] = useState("All");
  const [modal, setModal] = useState(ctx.openNew ? { type: "new" } : ctx.viewId ? { type: "view", id: ctx.viewId } : null);
  const [expiry, setExpiry] = useState("48h");

  const riskOf = (id) => computeRisk(events.filter((e) => e.iid === id));
  const counts = { All: interviews.length }; ["Scheduled", "In Progress", "Completed", "No Show", "Cancelled"].forEach((s) => (counts[s] = interviews.filter((i) => i.status === s).length));
  const rows = interviews.filter((iv) => {
    const q = search.toLowerCase();
    const matchQ = !q || [iv.id, iv.candidate.name, iv.candidate.email, iv.role, userById(iv.interviewer, users).name].some((x) => x.toLowerCase().includes(q));
    return matchQ && (status === "All" || iv.status === status) && (role === "All" || iv.role === role) && (interviewer === "All" || iv.interviewer === interviewer);
  }).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const current = modal && modal.id ? interviews.find((i) => i.id === modal.id) : null;
  const toForm = (iv) => ({ name: iv.candidate.name, email: iv.candidate.email, phone: iv.candidate.phone, location: iv.candidate.location, experience: iv.candidate.experience, company: iv.candidate.company, skills: iv.candidate.skills.join(", "), role: iv.role, interviewer: iv.interviewer, date: iv.date, time: iv.time, duration: iv.duration, notes: iv.notes || "" , currentTitle: (iv.candidate.resume && iv.candidate.resume.title) || "", resumeFile: (iv.candidate.resume && iv.candidate.resume.file) || "", highlights: ((iv.candidate.resume && iv.candidate.resume.projects) || []).map((p) => `${p.name}: ${p.desc}${p.impact ? " — " + p.impact : ""}`).join("\n") });
  const fromForm = (f) => ({ candidate: cand(f.name.trim(), f.email.trim(), f.phone, f.location, Number(f.experience) || 0, f.company, f.skills.split(",").map((s) => s.trim()).filter(Boolean), parseResume(f)), role: f.role, interviewer: f.interviewer, date: f.date, time: f.time, duration: Number(f.duration), notes: f.notes });

  const create = (f) => {
    const next = Math.max(...interviews.map((i) => Number(i.id.split("-")[1]))) + 1;
    const iv = { id: `INT-${next}`, ...fromForm(f), status: "Scheduled", consent: false, joinedAt: null, link: null };
    setInterviews((p) => [iv, ...p]); setModal({ type: "link", id: iv.id }); notify(`Interview ${iv.id} scheduled with ${iv.candidate.name}`);
  };
  const update = (f) => { const wasNoShow = current && current.status === "No Show"; setInterviews((p) => p.map((i) => (i.id === modal.id ? { ...i, ...fromForm(f), ...(wasNoShow ? { status: "Scheduled", joinedAt: null, consent: false, link: null } : {}) } : i))); setModal(null); notify(wasNoShow ? `Interview ${modal.id} rescheduled for ${fmtDate(f.date)}` : `Interview ${modal.id} updated`); };
  const cancel = (iv) => confirm({ title: "Cancel interview?", message: `This will cancel ${iv.id} with ${iv.candidate.name} on ${fmtDate(iv.date)} and invalidate the candidate link. The candidate will be notified by email.`, confirmLabel: "Cancel interview", danger: true, onConfirm: () => { setInterviews((p) => p.map((i) => (i.id === iv.id ? { ...i, status: "Cancelled", link: null } : i))); notify(`Interview ${iv.id} cancelled`, "warn"); } });
  const generateLink = (id) => { const link = `https://interview.${org.domain}/join/${id}-${randToken()}`; setInterviews((p) => p.map((i) => (i.id === id ? { ...i, link, linkExpiry: expiry } : i))); notify("Secure candidate link generated"); };

  return (
    <>
      <div className="ch-page-head">
        <div><div className="ch-crumb">Module · Interview Management</div><h1 className="ch-page-title">Interviews</h1><div className="ch-page-sub">Schedule interviews, manage candidates and generate secure join links.</div></div>
        <Btn icon="plus" onClick={() => setModal({ type: "new" })}>Schedule new interview</Btn>
      </div>
      <div className="row wrap mb-16">
        {["All", "Scheduled", "In Progress", "Completed", "No Show", "Cancelled"].map((s) => <button key={s} className={`chip ${status === s ? "active" : ""}`} onClick={() => setStatus(s)}>{s}<span className="cnt">{counts[s]}</span></button>)}
      </div>
      <Card noBody>
        <div className="toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Search candidate, ID, role, interviewer…" />
          <select className="inp inp-sm" style={{ width: "auto" }} value={role} onChange={(e) => setRole(e.target.value)}><option value="All">All roles</option>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
          <select className="inp inp-sm" style={{ width: "auto" }} value={interviewer} onChange={(e) => setInterviewer(e.target.value)}><option value="All">All interviewers</option>{users.filter((u) => u.role !== "Recruiter").map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
          {(search || role !== "All" || interviewer !== "All" || status !== "All") && <Btn size="sm" variant="ghost" icon="x" onClick={() => { setSearch(""); setRole("All"); setInterviewer("All"); setStatus("All"); }}>Clear filters</Btn>}
          <span className="small muted" style={{ marginLeft: "auto" }}>{rows.length} of {interviews.length} interviews</span>
        </div>
        {rows.length === 0 ? <EmptyState title="No interviews match your filters" text="Try adjusting the search or status filter." action={<Btn variant="secondary" onClick={() => { setSearch(""); setStatus("All"); setRole("All"); setInterviewer("All"); }}>Reset filters</Btn>} /> : (
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Candidate</th><th>Job role</th><th>Interviewer</th><th>Date & time</th><th>Status</th><th>Integrity</th><th>Score</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead><tbody>
            {rows.map((iv) => {
              const r = riskOf(iv.id); const sc = overallScore(evals[iv.id], weights); const isLive = live.iid === iv.id && live.status === "running";
              const editable = iv.status === "Scheduled" && !isLive; const reschedulable = editable || iv.status === "No Show";
              return (
                <tr key={iv.id}>
                  <td><Person name={iv.candidate.name} sub={`${iv.id} · ${iv.candidate.email}`} /></td>
                  <td className="small">{iv.role}</td>
                  <td className="small">{userById(iv.interviewer, users).name}</td>
                  <td className="small"><div className="bold">{fmtDate(iv.date, { day: "numeric", month: "short", year: "numeric" })}</div><div className="muted">{fmtTime(iv.time)} · {iv.duration} min</div></td>
                  <td>{isLive ? <Badge tone="red" dot pulse>Live now</Badge> : <StatusBadge status={iv.status} />}{!isLive && isDueNow(iv, now) && <div className="xs" style={{ color: "var(--purple)", fontWeight: 600, marginTop: 3 }}>Due now</div>}</td>
                  <td>{iv.status === "Completed" || isLive ? <RiskBadge score={r} /> : <span className="faint">—</span>}</td>
                  <td>{sc != null ? <b>{sc}</b> : <span className="faint">—</span>}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="icon-act" title="View details" onClick={() => setModal({ type: "view", id: iv.id })}><Icon name="eye" size={16} /></button>
                    <button className="icon-act" title={iv.status === "No Show" ? "Reschedule" : "Edit"} disabled={!reschedulable} onClick={() => setModal({ type: "edit", id: iv.id })}><Icon name={iv.status === "No Show" ? "refresh" : "edit"} size={16} /></button>
                    <button className="icon-act" title="Candidate link" disabled={iv.status !== "Scheduled"} onClick={() => setModal({ type: "link", id: iv.id })}><Icon name="link" size={16} /></button>
                    {iv.status === "Completed" ? <button className="icon-act" title="Open evaluation" onClick={() => go("evaluation", { evalId: iv.id })}><Icon name="sparkles" size={16} /></button>
                      : <button className="icon-act" title="Open interview room" disabled={iv.status === "Cancelled" || iv.status === "No Show"} onClick={() => go("room", { roomId: iv.id })}><Icon name="video" size={16} /></button>}
                    <button className="icon-act danger" title="Cancel interview" disabled={!editable} onClick={() => cancel(iv)}><Icon name="x" size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody></table></div>
        )}
      </Card>

      <Modal open={modal?.type === "new"} onClose={() => setModal(null)} title="Schedule new interview" subtitle="A secure candidate link is generated after scheduling." width={680}>
        <InterviewForm initial={EMPTY_FORM} users={users} onSubmit={create} onCancel={() => setModal(null)} submitLabel="Schedule interview" />
      </Modal>
      <Modal open={modal?.type === "edit" && !!current} onClose={() => setModal(null)} title={current?.status === "No Show" ? `Reschedule interview ${current.id}` : `Edit interview ${current?.id || ""}`} subtitle={current?.status === "No Show" ? "The candidate did not join the original slot. Pick a new date and time — a fresh link will be generated." : undefined} width={680}>
        {current && <InterviewForm initial={toForm(current)} users={users} onSubmit={update} onCancel={() => setModal(null)} submitLabel={current.status === "No Show" ? "Reschedule interview" : "Save changes"} />}
      </Modal>
      <Modal open={modal?.type === "view" && !!current} onClose={() => setModal(null)} title={current?.candidate.name} subtitle={current ? `${current.id} · ${current.role}` : ""} width={720}
        footer={current && <>
          {current.status === "Scheduled" && <Btn variant="soft-danger" icon="x" onClick={() => { setModal(null); cancel(current); }}>Cancel interview</Btn>}
          <span style={{ flex: 1 }} />
          {current.status === "Scheduled" && <Btn variant="secondary" icon="edit" onClick={() => setModal({ type: "edit", id: current.id })}>Edit</Btn>}
          {current.status === "No Show" && <Btn icon="refresh" onClick={() => setModal({ type: "edit", id: current.id })}>Reschedule</Btn>}
          {current.status === "Completed" ? <Btn icon="sparkles" onClick={() => go("evaluation", { evalId: current.id })}>Open evaluation</Btn> : (current.status === "Scheduled" || current.status === "In Progress") && <Btn icon="video" onClick={() => go("room", { roomId: current.id })}>Open interview room</Btn>}
        </>}>
        {current && (
          <div className="grid g-2">
            <div>
              <div className="section-title">Candidate</div>
              <div className="row mb-12"><Avatar name={current.candidate.name} size={48} /><div><div className="bold">{current.candidate.name}</div><div className="small muted">{current.candidate.experience} yrs · {current.candidate.company}</div></div></div>
              <dl className="kv"><dt>Email</dt><dd>{current.candidate.email}</dd><dt>Phone</dt><dd>{current.candidate.phone || "—"}</dd><dt>Location</dt><dd>{current.candidate.location || "—"}</dd><dt>Consent</dt><dd>{current.consent ? <Badge tone="green"><Icon name="check" size={12} />Accepted</Badge> : <Badge tone="amber">Pending</Badge>}</dd></dl>
              <div className="mt-12">{current.candidate.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
              <ResumeSummary resume={current.candidate.resume} />
            </div>
            <div>
              <div className="section-title">Interview</div>
              <dl className="kv"><dt>Status</dt><dd><StatusBadge status={current.status} /></dd><dt>Date</dt><dd>{fmtDate(current.date)}</dd><dt>Time</dt><dd>{fmtTime(current.time)} ({current.duration} min)</dd><dt>Job role</dt><dd>{current.role}</dd><dt>Attendance</dt><dd>{attendanceLabel(current, now)}</dd>
                <dt>Integrity risk</dt><dd>{current.status === "Completed" ? <RiskBadge score={riskOf(current.id)} /> : "Not started"}</dd><dt>Candidate link</dt><dd className="ellipsis">{current.link ? <span className="mono">{current.link}</span> : "Not generated"}</dd></dl>
              <div className="divider" />
              <div className="section-title">Interviewer</div>
              <Person name={userById(current.interviewer, users).name} sub={`${userById(current.interviewer, users).title} · ${userById(current.interviewer, users).email}`} />
              {current.notes && <div className="answer mt-12">{current.notes}</div>}
            </div>
          </div>
        )}
      </Modal>
      <Modal open={modal?.type === "link" && !!current} onClose={() => setModal(null)} title="Candidate interview link" subtitle={current ? `${current.candidate.name} · ${fmtDate(current.date)} at ${fmtTime(current.time)}` : ""} width={560}
        footer={<Btn variant="secondary" onClick={() => setModal(null)}>Done</Btn>}>
        {current && (
          <>
            <Field label="Link expiry"><div className="seg">{["24h", "48h", "7d"].map((x) => <button key={x} className={expiry === x ? "active" : ""} onClick={() => setExpiry(x)}>{x === "7d" ? "7 days" : x}</button>)}</div></Field>
            {current.link ? (
              <>
                <div className="row" style={{ gap: 8 }}><input className="inp mono" readOnly value={current.link} onFocus={(e) => e.target.select()} /><Btn variant="secondary" icon="copy" onClick={() => { copyText(current.link); notify("Link copied to clipboard"); }}>Copy</Btn></div>
                <div className="small muted mt-8">Single-use link · expires {current.linkExpiry || expiry} after first open · bound to {current.candidate.email}</div>
                <div className="row mt-16 wrap"><Btn icon="send" onClick={() => notify(`Invitation emailed to ${current.candidate.email} (simulated)`)}>Email to candidate</Btn><Btn variant="ghost" icon="refresh" onClick={() => generateLink(current.id)}>Regenerate</Btn></div>
              </>
            ) : <EmptyState icon="link" title="No link generated yet" text="Generate a secure, single-use link for this candidate." action={<Btn icon="link" onClick={() => generateLink(current.id)}>Generate link</Btn>} />}
            <div className="banner info mt-16"><Icon name="lock" size={18} /><div>Before joining, the candidate sees the <b>monitoring consent screen</b> explaining which signals are collected, how long recordings are kept ({90} days) and how to request deletion.</div></div>
          </>
        )}
      </Modal>
    </>
  );
}

/* ============================================================================
   PAGE: INTERVIEW ROOM
   ========================================================================== */
function ConsentModal({ open, onClose, onAccept, candidate, settings, orgName }) {
  const [c, setC] = useState({ a: false, b: false, c: false });
  useEffect(() => { if (open) setC({ a: false, b: false, c: false }); }, [open]);
  const all = c.a && c.b && c.c;
  return (
    <Modal open={open} onClose={onClose} title="Candidate view · Monitoring consent" subtitle={`Shown to ${candidate} before joining`} width={600}
      footer={<><Btn variant="secondary" onClick={onClose}>Decline</Btn><Btn icon="check" disabled={!all} onClick={onAccept}>I agree & join interview</Btn></>}>
      <div className="banner info mb-16"><Icon name="shieldCheck" size={18} /><div>{orgName} uses integrity monitoring to keep interviews fair for every candidate. <b>No decision is made automatically</b> — a human interviewer reviews every flag.</div></div>
      <div className="section-title">What we monitor during this interview</div>
      <div className="grid g-2 mb-16" style={{ gap: 8 }}>
        {FAMILY_KEYS.filter((k) => settings.signals[k]).map((k) => <div key={k} className="row small" style={{ gap: 8, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 10 }}><div className="fam-ic" style={{ width: 28, height: 28, background: FAMILIES[k].bg, color: FAMILIES[k].color }}><Icon name={FAMILIES[k].icon} size={14} /></div><div><b>{FAMILIES[k].label.replace(" Monitoring", "")}</b><div className="xs muted">{FAMILIES[k].signals.slice(0, 2).join(", ")}…</div></div></div>)}
      </div>
      <label className="checkline"><input type="checkbox" checked={c.a} onChange={(e) => setC({ ...c, a: e.target.checked })} /><span>I consent to audio and video recording and to the integrity signals listed above being collected during this interview.</span></label>
      <label className="checkline"><input type="checkbox" checked={c.b} onChange={(e) => setC({ ...c, b: e.target.checked })} /><span>I understand recordings are encrypted and auto-deleted after <b>{settings.retention} days</b>, and I can request export or deletion at any time (DPDP Act / GDPR).</span></label>
      <label className="checkline"><input type="checkbox" checked={c.c} onChange={(e) => setC({ ...c, c: e.target.checked })} /><span>I understand an on-screen indicator will show whenever monitoring is active.</span></label>
    </Modal>
  );
}

function VideoTile({ name, sub, on, children, anim = true, small }) {
  return (
    <div className={`vid ${on && anim ? "anim" : ""} ${!on ? "vid-off" : ""}`}>
      {on ? <div className="big-av" style={{ background: avColor(name), width: small ? 46 : 96, height: small ? 46 : 96, fontSize: small ? 16 : 32 }}>{initials(name)}</div>
        : <div className="col" style={{ alignItems: "center", gap: 8, color: "#8E98C2" }}><Icon name="videoOff" size={small ? 20 : 32} />{!small && <span className="small">Camera off</span>}</div>}
      {children}
      {!small && <div className="vid-label"><Icon name="user" size={14} />{name}{sub && <span style={{ opacity: 0.7, fontWeight: 500 }}>· {sub}</span>}</div>}
    </div>
  );
}

function RoomPage({ interviews, setInterviews, events, setEvents, questions, live, setLive, go, notify, confirm, ctx, users, settings, startInterview, endInterview, org }) {
  const roomable = interviews.filter((i) => i.status === "Scheduled" || i.status === "In Progress").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const initialSel = live.status === "running" ? live.iid : ctx.roomId && interviews.some((r) => r.id === ctx.roomId) ? ctx.roomId : roomable.some((r) => r.id === live.iid) || (live.status === "ended" && live.iid) ? live.iid : (roomable[0] && roomable[0].id) || live.iid;
  const [selId, setSelId] = useState(initialSel);
  const [consentOpen, setConsentOpen] = useState(false);
  const [tab, setTab] = useState("questions");
  const [qTab, setQTab] = useState("resume");
  const [analyzing, setAnalyzing] = useState(false);
  const iv = interviews.find((i) => i.id === selId);
  const isThis = live.iid === selId;
  const running = isThis && live.status === "running";
  const ended = iv && iv.status === "Completed";
  const qset = useMemo(() => (iv ? QA_LIB[roleSet(iv.role)].map((qa) => questions.find((q) => q.id === qa.qid)).filter(Boolean) : []), [iv && iv.role, questions]); // eslint-disable-line react-hooks/exhaustive-deps
  const resumeQs = useMemo(() => (iv ? resumeQuestions(iv.candidate, iv.role) : []), [iv && iv.candidate, iv && iv.role]); // eslint-disable-line react-hooks/exhaustive-deps
  const bankQs = useMemo(() => qset.map((q) => ({ key: "bank-" + q.id, type: "bank", bankId: q.id, text: q.text, source: `Question bank · ${q.id} · ${q.category} · ${q.difficulty} · rubric-backed`, listen: q.rubric[5] })), [qset]);
  const history = isThis ? live.history || [] : [];
  const qIndex = Math.max(0, Math.min(isThis ? live.qIndex : 0, history.length - 1));
  const cur = history[qIndex];
  const askedKeys = new Set(history.map((h) => h.key));
  const answers = isThis ? live.answers || {} : {};
  const analyses = isThis ? live.analyses || {} : {};
  const curAnswer = cur ? answers[cur.key] || "" : "";
  const curAnalysis = cur ? analyses[cur.key] : null;
  const latestFU = curAnalysis ? curAnalysis.followUps.filter((f) => !askedKeys.has(f.key)) : [];
  const earlierFU = Object.values(analyses).flatMap((a) => a.followUps).filter((f) => !askedKeys.has(f.key) && !latestFU.some((x) => x.key === f.key));
  const resumeOpen = resumeQs.filter((q) => !askedKeys.has(q.key));
  const bankOpen = bankQs.filter((q) => !askedKeys.has(q.key));
  const nextSuggestion = latestFU[0] || earlierFU[0] || resumeOpen[0] || bankOpen[0];
  const ivEvents = events.filter((e) => e.iid === selId);
  const risk = computeRisk(ivEvents);
  const lastEvent = ivEvents[ivEvents.length - 1];
  const recentVideoFlag = running && lastEvent && lastEvent.family === "Video" && live.elapsed - tsToSec(lastEvent.ts) < 6;
  useEffect(() => {
    if (live.status !== "running" && live.iid !== selId) setLive((l) => ({ ...l, iid: selId, status: "idle", elapsed: 0, qIndex: 0, notes: {}, history: [], answers: {}, analyses: {}, fired: [], consent: false }));
  }, [selId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!iv) {
    return (<><div className="ch-page-head"><div><div className="ch-crumb">Module · Live Interview</div><h1 className="ch-page-title">Interview Room</h1></div></div>
      <Card><EmptyState icon="video" title="No interviews ready for the room" text="Schedule an interview to open a live room." action={<Btn icon="plus" onClick={() => go("interviews", { openNew: true })}>Schedule interview</Btn>} /></Card></>);
  }
  const interviewerName = userById(iv.interviewer, users).name;
  const selectRoom = (id) => { if (live.status === "running") { notify("End the current live interview before switching rooms", "warn"); return; } setSelId(id); };
  const consentGiven = iv.consent || (isThis && live.consent);
  const ask = (qo) => {
    if (!running || !qo) return;
    setLive((l) => { const h = l.history || []; const i = h.findIndex((x) => x.key === qo.key); if (i >= 0) return { ...l, qIndex: i }; return { ...l, history: [...h, { ...qo, askedAt: fmtClock(l.elapsed) }], qIndex: h.length }; });
  };
  const goTo = (i) => setLive((l) => ({ ...l, qIndex: i }));
  const setAnswer = (txt) => cur && setLive((l) => ({ ...l, answers: { ...(l.answers || {}), [cur.key]: txt } }));
  const capture = () => { setAnswer(simulateAnswer(cur, iv.candidate, iv.role, org.shortName)); notify("Answer captured from the live transcript (simulated)", "info"); };
  const analyze = () => {
    if (!cur || !curAnswer.trim()) return;
    const qo = cur; const txt = curAnswer; setAnalyzing(true);
    setTimeout(() => {
      const a = { ...analyzeAnswer(txt, qo, iv.candidate, org.shortName), forText: txt };
      setLive((l) => ({ ...l, analyses: { ...(l.analyses || {}), [qo.key]: a } }));
      setAnalyzing(false); setQTab("followups");
      notify(`${a.followUps.length} contextual follow-up${a.followUps.length === 1 ? "" : "s"} suggested from the candidate's answer`, "info");
    }, 900);
  };
  const noteVal = (isThis && cur && live.notes[cur.key]) || "";
  const answerWords = curAnswer.trim() ? curAnswer.trim().split(/\s+/).length : 0;
  const renderSuggestion = (s) => {
    const asked = askedKeys.has(s.key);
    return (
      <div key={s.key} className="feed-item" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="small" style={{ fontWeight: 600, lineHeight: 1.45 }}>{s.text}</div>
          <div className="xs muted" style={{ marginTop: 4 }}>{s.reason || s.source}</div>
        </div>
        {asked ? <Badge tone="green"><Icon name="check" size={11} />Asked</Badge> : <Btn size="sm" variant="secondary" disabled={!running} title={!running ? "Start the interview to ask questions" : ""} onClick={() => ask(s)}>Ask</Btn>}
      </div>
    );
  };

  return (
    <>
      <div className="ch-page-head">
        <div>
          <div className="ch-crumb">Module · Live Interview</div>
          <h1 className="ch-page-title">Interview Room</h1>
          <div className="ch-page-sub">{iv.candidate.name} · {iv.role} · {fmtDate(iv.date, { day: "numeric", month: "short" })}, {fmtTime(iv.time)}</div>
        </div>
        <div className="row wrap">
          <select className="inp" style={{ width: 300 }} value={selId} onChange={(e) => selectRoom(e.target.value)} disabled={live.status === "running"}>
            {roomable.map((r) => <option key={r.id} value={r.id}>{r.id} · {r.candidate.name} ({fmtDate(r.date, { day: "numeric", month: "short" })})</option>)}
            {!roomable.some((r) => r.id === selId) && <option value={selId}>{iv.id} · {iv.candidate.name} (completed)</option>}
          </select>
        </div>
      </div>

      <div className="card mb-16" style={{ padding: "14px 18px" }}>
        <div className="row between wrap" style={{ gap: 14 }}>
          <div className="row wrap" style={{ gap: 14 }}>
            <div><div className="xs muted bold" style={{ letterSpacing: 0.6 }}>ELAPSED</div><div className="timer">{fmtClock(isThis ? live.elapsed : 0)}</div></div>
            <div style={{ width: 1, height: 38, background: "var(--border)" }} />
            {running ? <Badge tone="red" dot pulse>LIVE · Recording</Badge> : ended ? <Badge tone="green"><Icon name="check" size={12} />Interview ended</Badge> : <Badge tone="blue" dot>Ready · Waiting room</Badge>}
            {running ? <MonitoringIndicator /> : consentGiven ? <Badge tone="green"><Icon name="shieldCheck" size={12} />Consent recorded</Badge> : <Badge tone="amber"><Icon name="alert" size={12} />Consent pending</Badge>}
            <span className="small muted">{iv.duration} min slot</span>
          </div>
          <div className="row wrap">
            {!running && !ended && !consentGiven && <Btn variant="secondary" icon="shieldCheck" onClick={() => setConsentOpen(true)}>Simulate candidate consent</Btn>}
            {!running && !ended && <Btn variant="success" icon="play" disabled={!consentGiven} title={!consentGiven ? "Candidate must accept monitoring consent first" : ""} onClick={() => startInterview(iv.id)}>Start interview</Btn>}
            {running && <Btn variant="danger" icon="stop" onClick={() => confirm({ title: "End interview?", message: "Recording stops and the AI evaluation draft is generated from the transcript. You'll review and sign off the scorecard — nothing is sent to the candidate automatically.", confirmLabel: "End interview", danger: true, onConfirm: () => endInterview(iv.id) })}>End interview</Btn>}
            {ended && <Btn icon="sparkles" onClick={() => go("evaluation", { evalId: iv.id })}>Review AI evaluation</Btn>}
          </div>
        </div>
      </div>

      <div className="room-grid">
        <div className="col" style={{ gap: 18, minWidth: 0 }}>
          <div className="card" style={{ padding: 10 }}>
            <div className="stage">
              <VideoTile name={iv.candidate.name} sub="Candidate" on={running ? live.candCam : true} anim={running}>
                {running && settings.signals.Video && <div className={`face-box ${recentVideoFlag ? "alert" : ""}`}><span>{recentVideoFlag ? `⚠ ${lastEvent.signal}` : "Face detected · 1 person"}</span></div>}
              </VideoTile>
              <div className="vid-top">
                <div className="row" style={{ gap: 6 }}>{running && <span className="vid-chip"><span className="rec-dot" />REC {fmtClock(live.elapsed)}</span>}<span className="vid-chip"><Icon name="lock" size={12} />End-to-end encrypted</span></div>
                {running && <span className="vid-chip" style={{ background: "rgba(220,61,75,.85)" }}><Icon name="eye" size={12} />Integrity monitoring on</span>}
              </div>
              <div className="pip"><VideoTile name={interviewerName} on={live.cam} small anim={false} /><div className="vid-chip" style={{ position: "absolute", left: 6, bottom: 6, fontSize: 10.5, padding: "3px 7px" }}>You {!live.mic && <Icon name="micOff" size={11} />}</div></div>
              {!running && !ended && (
                <div className="lobby">
                  <Icon name="clock" size={30} />
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{consentGiven ? `${iv.candidate.name.split(" ")[0]} is in the waiting room` : `Waiting for ${iv.candidate.name.split(" ")[0]} to accept consent`}</div>
                  <div className="small" style={{ opacity: 0.8, maxWidth: 380 }}>{consentGiven ? "Camera and microphone check passed. Start the interview when you're ready." : "The candidate must accept the monitoring consent screen before joining."}</div>
                </div>
              )}
              {ended && <div className="lobby"><Icon name="check" size={30} /><div style={{ fontSize: 17, fontWeight: 700 }}>Interview ended</div><div className="small" style={{ opacity: 0.8 }}>Recording saved · AI evaluation draft generated</div></div>}
            </div>
            <div className="ctrl-bar">
              <button className={`ctrl ${!live.mic ? "off" : ""}`} title={live.mic ? "Mute microphone" : "Unmute microphone"} onClick={() => setLive((l) => ({ ...l, mic: !l.mic }))}><Icon name={live.mic ? "mic" : "micOff"} /></button>
              <button className={`ctrl ${!live.cam ? "off" : ""}`} title={live.cam ? "Turn camera off" : "Turn camera on"} onClick={() => setLive((l) => ({ ...l, cam: !l.cam }))}><Icon name={live.cam ? "video" : "videoOff"} /></button>
              <button className="ctrl" title="Bookmark this moment" disabled={!running || !cur} onClick={() => { setLive((l) => ({ ...l, notes: { ...l.notes, [cur.key]: `${l.notes[cur.key] || ""}${l.notes[cur.key] ? "\n" : ""}[${fmtClock(l.elapsed)}] ★ Bookmarked moment` } })); notify(`Moment bookmarked at ${fmtClock(live.elapsed)}`); }}><Icon name="bookmark" /></button>
              <button className="ctrl" title="Share screen (simulated)" onClick={() => notify("Screen sharing is simulated in this prototype", "info")}><Icon name="monitor" /></button>
              <span className="small muted" style={{ marginLeft: 8 }}>Mic {live.mic ? "on" : "muted"} · Camera {live.cam ? "on" : "off"}</span>
            </div>
          </div>

          <div className="grid g-2">
            <Card title="Candidate" icon="user">
              <div className="row mb-12"><Avatar name={iv.candidate.name} size={44} /><div><div className="bold">{iv.candidate.name}</div><div className="small muted">{iv.candidate.experience} yrs · {iv.candidate.company}</div></div></div>
              <dl className="kv" style={{ gridTemplateColumns: "92px 1fr" }}><dt>Role</dt><dd>{iv.role}</dd><dt>Location</dt><dd>{iv.candidate.location}</dd><dt>Email</dt><dd className="ellipsis">{iv.candidate.email}</dd><dt>Interviewer</dt><dd>{userById(iv.interviewer, users).name}</dd></dl>
              <div className="mt-12">{iv.candidate.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
              <ResumeSummary resume={iv.candidate.resume} />
            </Card>
            <Card title="Live Integrity" icon="shield" subtitle="Simulated signals" actions={<Btn size="sm" variant="ghost" iconRight="arrowRight" onClick={() => go("integrity", { integrityId: iv.id })}>Details</Btn>}>
              {!running && ivEvents.length === 0 ? <div className="small muted" style={{ padding: "20px 0", textAlign: "center" }}>Monitoring starts when the interview begins.</div> : (
                <>
                  <div className="row" style={{ gap: 14 }}><Gauge value={risk} size={150} label={false} /><div><RiskBadge score={risk} /><div className="xs muted mt-8">{ivEvents.filter((e) => e.status === "active").length} active flags · {ivEvents.filter((e) => e.status === "dismissed").length} dismissed</div></div></div>
                  <div style={{ maxHeight: 190, overflowY: "auto" }}>
                    {[...ivEvents].reverse().map((e) => { const F = FAMILIES[e.family]; return (
                      <div key={e.id} className="feed-item" style={{ opacity: e.status === "dismissed" ? 0.5 : 1 }}>
                        <div className="fam-ic" style={{ width: 28, height: 28, background: F.bg, color: F.color }}><Icon name={F.icon} size={14} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}><div className="row between"><b className="small">{e.signal}</b><span className="xs mono faint">{e.ts}</span></div><div className="xs muted">{Math.round(e.conf * 100)}% confidence · {sevLabel(e.sev)}</div></div>
                        {e.status === "active" ? <button className="icon-act" title="Dismiss flag" onClick={() => { setEvents((p) => p.map((x) => (x.id === e.id ? { ...x, status: "dismissed", notes: [...x.notes, { by: interviewerName, at: "Live", text: "Dismissed during live interview" }] } : x))); notify("Flag dismissed — logged to audit trail"); }}><Icon name="x" size={14} /></button> : <Badge>Dismissed</Badge>}
                      </div>
                    ); })}
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>

        <div className="col" style={{ gap: 18, minWidth: 0 }}>
          <Card title="Question Panel" icon="sparkles" subtitle="AI-assisted · resume-based questions and follow-ups from the candidate's answers" actions={<Badge tone="purple">Mock AI</Badge>}>
            <div className="xs muted mb-12">The assistant suggests — the interviewer decides what to ask. Suggestions come only from this candidate's resume, the role's question bank and what the candidate actually said.</div>
            {history.length > 0 && <div className="q-nav-pills mb-12">{history.map((h, i) => <button key={h.key} title={h.text} className={`q-pill ${i === qIndex ? "active" : analyses[h.key] ? "done" : ""}`} onClick={() => goTo(i)}>{i + 1}</button>)}</div>}
            {!cur ? (
              <div className="answer small" style={{ textAlign: "center", padding: 18 }}>{ended ? "This interview has ended." : running ? "Choose a question from the suggestions below to begin." : "Start the interview — the assistant opens with a resume-based question. You can preview the suggestions below."}</div>
            ) : (
              <>
                <div className="row wrap mb-12" style={{ gap: 6 }}><Badge tone={QTYPE_META[cur.type][1]}>{QTYPE_META[cur.type][0]}</Badge>{cur.bankId && <Badge tone="gray">{cur.bankId}</Badge>}<span className="xs muted">Asked at {cur.askedAt}</span></div>
                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.45 }}>{cur.text}</div>
                <div className="xs muted mt-8 row" style={{ gap: 5, alignItems: "flex-start" }}><Icon name="info" size={13} /><span><b>Why this question:</b> {cur.reason || cur.source}</span></div>
                <div className="xs mt-8" style={{ color: "var(--text-2)" }}><b>Listen for:</b> {cur.listen}</div>
                <div className="section-title mt-16">Candidate's answer · live transcript</div>
                <textarea className="inp" style={{ minHeight: 96 }} disabled={!running} value={curAnswer} placeholder="The candidate's response appears here from the live transcript. You can also type or correct it." onChange={(e) => setAnswer(e.target.value)} />
                <div className="row wrap mt-8" style={{ gap: 8 }}>
                  <Btn size="sm" variant="secondary" icon="mic" disabled={!running} onClick={capture}>Capture from transcript (simulated)</Btn>
                  <Btn size="sm" variant="navy" icon="sparkles" disabled={!running || analyzing || answerWords < 5} title={answerWords < 5 ? "Capture or type at least a few words of the answer first" : ""} onClick={analyze}>{analyzing ? "Analyzing answer…" : curAnalysis && curAnalysis.forText !== curAnswer ? "Re-analyze answer" : "Analyze answer"}</Btn>
                </div>
                {curAnalysis && (
                  <div className="answer mt-12" style={{ padding: 12 }}>
                    <div className="row between wrap"><b className="small">AI answer analysis</b><span className="xs muted">{curAnalysis.forText !== curAnswer ? "Answer edited since analysis" : `at ${curAnalysis.at}`}</span></div>
                    <div className="row wrap mt-8" style={{ gap: 6 }}>{curAnalysis.topics.length ? curAnalysis.topics.map((t) => <span key={t} className="tag">{t}</span>) : <span className="xs muted">No specific technical topics detected</span>}{curAnalysis.metrics.map((m) => <Badge key={m} tone="green">{m.trim()}</Badge>)}</div>
                    <div className="xs muted mt-8">Depth: <b>{curAnalysis.depth}</b> ({curAnalysis.words} words) · Ownership: “I” ×{curAnalysis.iCount} / “we” ×{curAnalysis.weCount} · {curAnalysis.followUps.length} follow-ups suggested</div>
                  </div>
                )}
                <div className="row between mt-16">
                  <Btn variant="secondary" size="sm" icon="chevronLeft" disabled={qIndex === 0} onClick={() => goTo(qIndex - 1)}>Previous</Btn>
                  <span className="small muted">Question {qIndex + 1} of {history.length} asked</span>
                  <Btn variant="navy" size="sm" iconRight="chevronRight" disabled={qIndex >= history.length - 1 && (!running || !nextSuggestion)} title={qIndex >= history.length - 1 && nextSuggestion ? `Ask next suggestion: ${nextSuggestion.text}` : ""} onClick={() => (qIndex < history.length - 1 ? goTo(qIndex + 1) : ask(nextSuggestion))}>{qIndex < history.length - 1 ? "Next" : "Next suggested"}</Btn>
                </div>
              </>
            )}
            <div className="divider" />
            <div className="tabs" style={{ marginBottom: 6 }}>
              {[["followups", "Follow-ups", latestFU.length + earlierFU.length], ["resume", "Resume-based", resumeOpen.length], ["bank", "Question bank", bankOpen.length]].map(([k, l, n]) => <button key={k} className={`tab ${qTab === k ? "active" : ""}`} onClick={() => setQTab(k)}>{l}<span className="badge b-gray" style={{ padding: "0 7px" }}>{n}</span></button>)}
            </div>
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {qTab === "followups" && (latestFU.length + earlierFU.length === 0 ? (
                <div className="small muted" style={{ textAlign: "center", padding: "18px 8px" }}>Capture the candidate's answer and click <b>Analyze answer</b> — follow-up questions will be generated from what they actually said.</div>
              ) : (
                <>
                  {latestFU.length > 0 && <div className="xs bold muted" style={{ marginTop: 6 }}>FROM THE LATEST ANSWER</div>}
                  {latestFU.map(renderSuggestion)}
                  {earlierFU.length > 0 && <div className="xs bold muted" style={{ marginTop: 10 }}>FROM EARLIER ANSWERS · NOT YET ASKED</div>}
                  {earlierFU.map(renderSuggestion)}
                </>
              ))}
              {qTab === "resume" && (
                <>
                  <div className="row between xs muted" style={{ marginTop: 6 }}><span>Generated from {iv.candidate.resume && iv.candidate.resume.file ? iv.candidate.resume.file : "candidate profile"} · skills, projects & experience</span></div>
                  {resumeQs.map(renderSuggestion)}
                </>
              )}
              {qTab === "bank" && (bankQs.length ? bankQs.map(renderSuggestion) : <div className="small muted" style={{ textAlign: "center", padding: 18 }}>No question-bank questions for this role.</div>)}
            </div>
          </Card>
          <Card title="Interview Notes" icon="note" subtitle="Private · merged into the evaluation view" actions={<span className="xs muted">{isThis ? "Autosaved" : ""}</span>}>
            <div className="tabs" style={{ marginBottom: 12 }}>{[["questions", "This question"], ["all", "All notes"]].map(([k, l]) => <button key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</button>)}</div>
            {tab === "questions" ? (
              <textarea className="inp" style={{ minHeight: 150 }} disabled={!running || !cur} value={noteVal} placeholder={running && cur ? `Notes for question ${qIndex + 1}… (e.g. strong on trade-offs, asked clarifying question)` : "Start the interview to take notes"} onChange={(e) => setLive((l) => ({ ...l, notes: { ...l.notes, [cur.key]: e.target.value } }))} />
            ) : (
              <div style={{ maxHeight: 210, overflowY: "auto" }}>
                {isThis && history.some((h) => live.notes[h.key]) ? history.map((h, i) => live.notes[h.key] && <div key={h.key} className="mb-12"><div className="xs bold muted">Q{i + 1} · {h.text.slice(0, 70)}{h.text.length > 70 ? "…" : ""}</div><div className="small" style={{ whiteSpace: "pre-wrap" }}>{live.notes[h.key]}</div></div>) : <div className="small muted" style={{ textAlign: "center", padding: 20 }}>No notes yet.</div>}
              </div>
            )}
          </Card>
          <div className="banner info"><Icon name="info" size={18} /><div className="small">Integrity signals, transcript capture and AI question suggestions in this prototype are <b>simulated</b> in the browser — no real AI service is called. A high score means “look closer” — it never ends or fails an interview automatically.</div></div>
        </div>
      </div>
      <ConsentModal open={consentOpen} onClose={() => setConsentOpen(false)} candidate={iv.candidate.name} settings={settings} orgName={org.shortName}
        onAccept={() => { setInterviews((p) => p.map((i) => (i.id === iv.id ? { ...i, consent: true, joinedAt: i.joinedAt || new Date().toTimeString().slice(0, 5) } : i))); setLive((l) => ({ ...l, iid: iv.id, consent: true })); setConsentOpen(false); notify(`${iv.candidate.name} accepted monitoring consent`); }} />
    </>
  );
}

/* ============================================================================
   PAGE: QUESTION BANK
   ========================================================================== */
const EMPTY_Q = { text: "", category: "Technical", topic: "System Design", difficulty: "Medium", dim: "tech", time: 10, rubric: { 5: "", 3: "", 1: "" } };
const TOPICS = ["System Design", "Algorithms", "Debugging", "Frontend", "Data Science", "Product Sense", "Collaboration", "Communication", "Leadership", "Experience"];

function QuestionForm({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial); const [err, setErr] = useState({});
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const submit = () => { const e = {}; if (f.text.trim().length < 10) e.text = "Question must be at least 10 characters"; if (!f.rubric[5].trim()) e.r5 = "Describe what a strong (5) answer looks like"; setErr(e); if (!Object.keys(e).length) onSubmit(f); };
  return (
    <>
      <Field label="Question *" error={err.text}><textarea className={`inp ${err.text ? "invalid" : ""}`} value={f.text} onChange={(e) => set("text", e.target.value)} placeholder="Write the question as you'd ask it…" /></Field>
      <div className="grid g-3" style={{ gap: "0 14px" }}>
        <Field label="Category"><select className="inp" value={f.category} onChange={(e) => set("category", e.target.value)}><option>Technical</option><option>Behavioral</option></select></Field>
        <Field label="Difficulty"><select className="inp" value={f.difficulty} onChange={(e) => set("difficulty", e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select></Field>
        <Field label="Time (min)"><input className="inp" type="number" min="1" value={f.time} onChange={(e) => set("time", Number(e.target.value))} /></Field>
        <Field label="Topic"><select className="inp" value={f.topic} onChange={(e) => set("topic", e.target.value)}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Scoring dimension" style={{ gridColumn: "span 2" }}><select className="inp" value={f.dim} onChange={(e) => set("dim", e.target.value)}>{DIMS.map((d) => <option key={d.key} value={d.key}>{d.label} — {d.looks}</option>)}</select></Field>
      </div>
      <div className="section-title mt-8">Rubric (used by the AI to anchor scores)</div>
      {[5, 3, 1].map((lv) => <Field key={lv} label={`Score ${lv} — ${lv === 5 ? "Strong" : lv === 3 ? "Adequate" : "Weak"}${lv === 5 ? " *" : ""}`} error={lv === 5 ? err.r5 : null}><input className={`inp ${lv === 5 && err.r5 ? "invalid" : ""}`} value={f.rubric[lv]} onChange={(e) => set("rubric", { ...f.rubric, [lv]: e.target.value })} /></Field>)}
      <div className="row mt-8" style={{ justifyContent: "flex-end" }}><Btn variant="secondary" onClick={onCancel}>Cancel</Btn><Btn icon="check" onClick={submit}>Save question</Btn></div>
    </>
  );
}

function QuestionBankPage({ questions, setQuestions, notify, confirm }) {
  const [search, setSearch] = useState(""); const [cat, setCat] = useState("All"); const [diff, setDiff] = useState("All"); const [topic, setTopic] = useState("All");
  const [modal, setModal] = useState(null); const [open, setOpen] = useState(null);
  const rows = questions.filter((q) => (!search || (q.text + q.id + q.topic).toLowerCase().includes(search.toLowerCase())) && (cat === "All" || q.category === cat) && (diff === "All" || q.difficulty === diff) && (topic === "All" || q.topic === topic));
  const save = (f) => {
    if (modal.id) { setQuestions((p) => p.map((q) => (q.id === modal.id ? { ...q, ...f } : q))); notify(`${modal.id} updated`); }
    else { const n = Math.max(...questions.map((q) => Number(q.id.split("-")[1]))) + 1; const id = `Q-${n}`; setQuestions((p) => [{ ...f, id, usage: 0 }, ...p]); notify(`Question ${id} added to the bank`); }
    setModal(null);
  };
  const del = (q) => confirm({ title: "Delete question?", message: `"${q.text.slice(0, 80)}…" will be removed from the bank. Past evaluations keep their copy.`, confirmLabel: "Delete", danger: true, onConfirm: () => { setQuestions((p) => p.filter((x) => x.id !== q.id)); notify(`${q.id} deleted`, "warn"); } });
  const stat = (k, v) => questions.filter((q) => q[k] === v).length;
  return (
    <>
      <div className="ch-page-head">
        <div><div className="ch-crumb">Module · Content</div><h1 className="ch-page-title">Question Bank</h1><div className="ch-page-sub">Rubric-backed questions. Each rubric anchors the AI's scoring and evidence quotes.</div></div>
        <Btn icon="plus" onClick={() => setModal({ initial: EMPTY_Q })}>Add new question</Btn>
      </div>
      <div className="grid g-4 mb-16">
        <StatCard icon="book" label="Total questions" value={questions.length} tone="navy" onClick={() => { setCat("All"); setDiff("All"); }} />
        <StatCard icon="cpu" label="Technical" value={stat("category", "Technical")} tone="purple" onClick={() => setCat("Technical")} />
        <StatCard icon="message" label="Behavioral" value={stat("category", "Behavioral")} tone="blue" onClick={() => setCat("Behavioral")} />
        <StatCard icon="target" label="Hard difficulty" value={stat("difficulty", "Hard")} tone="red" onClick={() => setDiff("Hard")} />
      </div>
      <Card noBody>
        <div className="toolbar">
          <SearchBox value={search} onChange={setSearch} placeholder="Search questions…" />
          <div className="seg">{["All", "Technical", "Behavioral"].map((c) => <button key={c} className={cat === c ? "active" : ""} onClick={() => setCat(c)}>{c}</button>)}</div>
          <select className="inp inp-sm" style={{ width: "auto" }} value={diff} onChange={(e) => setDiff(e.target.value)}><option value="All">All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
          <select className="inp inp-sm" style={{ width: "auto" }} value={topic} onChange={(e) => setTopic(e.target.value)}><option value="All">All topics</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
          <span className="small muted" style={{ marginLeft: "auto" }}>{rows.length} questions</span>
        </div>
        {rows.length === 0 ? <EmptyState icon="book" title="No questions found" text="Adjust filters or add a new question." action={<Btn icon="plus" onClick={() => setModal({ initial: EMPTY_Q })}>Add question</Btn>} /> : rows.map((q) => (
          <div key={q.id} style={{ borderBottom: "1px solid var(--border-2)" }}>
            <div className="row" style={{ padding: "14px 18px", alignItems: "flex-start", cursor: "pointer" }} onClick={() => setOpen(open === q.id ? null : q.id)}>
              <Icon name={open === q.id ? "chevronDown" : "chevronRight"} size={16} style={{ marginTop: 3, color: "var(--faint)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row wrap" style={{ gap: 6, marginBottom: 5 }}><span className="mono faint">{q.id}</span><Badge tone={q.category === "Technical" ? "purple" : "blue"}>{q.category}</Badge><Badge tone={q.difficulty === "Hard" ? "red" : q.difficulty === "Medium" ? "amber" : "green"}>{q.difficulty}</Badge><span className="tag">{q.topic}</span><span className="tag">{DIMS.find((d) => d.key === q.dim)?.label}</span></div>
                <div style={{ fontWeight: 550 }}>{q.text}</div>
              </div>
              <div className="small muted" style={{ textAlign: "right", whiteSpace: "nowrap" }}><div>{q.time} min</div><div className="xs">used {q.usage}×</div></div>
              <div className="row" style={{ gap: 2 }} onClick={(e) => e.stopPropagation()}>
                <button className="icon-act" title="Edit" onClick={() => setModal({ id: q.id, initial: { ...q, rubric: { ...q.rubric } } })}><Icon name="edit" size={16} /></button>
                <button className="icon-act danger" title="Delete" onClick={() => del(q)}><Icon name="trash" size={16} /></button>
              </div>
            </div>
            {open === q.id && (
              <div style={{ padding: "0 18px 16px 46px", animation: "ch-fade .2s" }}>
                <div className="section-title">Rubric</div>
                <div className="grid g-3" style={{ gap: 10 }}>{[5, 3, 1].map((lv) => <div key={lv} className="answer"><div className="row mb-12" style={{ marginBottom: 6 }}><ScorePill value={lv} /><b className="small">{lv === 5 ? "Strong" : lv === 3 ? "Adequate" : "Weak"}</b></div><div className="small">{q.rubric[lv] || <span className="faint">Not defined</span>}</div></div>)}</div>
              </div>
            )}
          </div>
        ))}
      </Card>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.id ? `Edit ${modal.id}` : "Add new question"} subtitle="Questions with clear rubrics produce more consistent AI-assisted scores." width={680}>
        {modal && <QuestionForm initial={modal.initial} onSubmit={save} onCancel={() => setModal(null)} />}
      </Modal>
    </>
  );
}

/* ============================================================================
   PAGE: INTEGRITY MONITORING
   ========================================================================== */
function EvidenceView({ e }) {
  const F = FAMILIES[e.family];
  if (e.evidence.kind === "frame") return (
    <div className="evidence-frame"><div className="scan" />
      <div className="big-av" style={{ background: "#3A4A9A", width: 70, height: 70, fontSize: 22 }}><Icon name="user" size={30} /></div>
      {e.signal === "Multiple faces" && <div style={{ position: "absolute", left: "6%", top: "24%", width: "16%", height: "40%", border: "2px solid #FF6B78", borderRadius: 10 }}><span style={{ position: "absolute", top: -20, left: 0, fontSize: 10, background: "#FF6B78", padding: "1px 5px", borderRadius: 4 }}>face #2</span></div>}
      {e.signal === "Phone detection" && <div style={{ position: "absolute", right: "14%", bottom: "8%", width: "12%", height: "26%", border: "2px solid #FF6B78", borderRadius: 8 }}><span style={{ position: "absolute", top: -20, left: 0, fontSize: 10, background: "#FF6B78", padding: "1px 5px", borderRadius: 4, whiteSpace: "nowrap" }}>phone {Math.round(e.conf * 100)}%</span></div>}
      <div className="vid-chip" style={{ position: "absolute", left: 10, bottom: 10 }}><Icon name="play" size={11} />10 s evidence clip · {e.ts}</div>
      <div className="vid-chip" style={{ position: "absolute", right: 10, top: 10 }}>Simulated frame</div>
    </div>
  );
  if (e.evidence.kind === "audio") return (
    <div className="evidence-frame" style={{ aspectRatio: "auto", padding: "26px 16px" }}>
      <div className="wave">{Array.from({ length: 64 }).map((_, i) => { const h = 10 + Math.abs(Math.sin(i * 0.7) * 30) + ((i * 37) % 17); return <i key={i} className={i > 26 && i < 42 ? "hl" : ""} style={{ height: h }} />; })}</div>
      <div className="vid-chip" style={{ position: "absolute", left: 10, bottom: 8 }}><Icon name="volume" size={11} />10 s audio clip · highlighted segment flagged</div>
    </div>
  );
  return <div className="logbox">{`# ${F.label} · ${e.signal}\n# captured at ${e.ts} · source: ${F.how}\n\n${e.evidence.detail}`}</div>;
}

function IntegrityPage({ interviews, events, setEvents, notify, ctx, go, settings, live }) {
  const monitored = interviews.filter((i) => i.status === "Completed" || (live.iid === i.id && live.status !== "idle") || events.some((e) => e.iid === i.id));
  const sorted = [...monitored].sort((a, b) => computeRisk(events.filter((e) => e.iid === b.id)) - computeRisk(events.filter((e) => e.iid === a.id)));
  const [selId, setSelId] = useState(ctx.integrityId && monitored.some((m) => m.id === ctx.integrityId) ? ctx.integrityId : sorted[0]?.id);
  const [fam, setFam] = useState("All"); const [st, setSt] = useState("All"); const [q, setQ] = useState("");
  const [openEv, setOpenEv] = useState(ctx.eventId || null); const [note, setNote] = useState("");
  const iv = interviews.find((i) => i.id === selId);
  if (!iv) return <><div className="ch-page-head"><div><div className="ch-crumb">Module A · Interview Integrity</div><h1 className="ch-page-title">Integrity Monitoring</h1></div></div><Card><EmptyState icon="shield" title="No monitored interviews yet" text="Integrity data appears once an interview has started." /></Card></>;
  const ivEv = events.filter((e) => e.iid === selId);
  const risk = computeRisk(ivEv);
  const isLive = live.iid === selId && live.status === "running";
  const durSec = Math.max(iv.duration * 60, ...ivEv.map((e) => tsToSec(e.ts) + 60));
  const list = ivEv.filter((e) => (fam === "All" || e.family === fam) && (st === "All" || e.status === st) && (!q || (e.signal + e.desc).toLowerCase().includes(q.toLowerCase()))).sort((a, b) => a.ts.localeCompare(b.ts));
  const evOpen = events.find((e) => e.id === openEv);
  const update = (id, fn) => setEvents((p) => p.map((e) => (e.id === id ? fn(e) : e)));
  const dismiss = (e) => { update(e.id, (x) => ({ ...x, status: x.status === "dismissed" ? "active" : "dismissed", notes: [...x.notes, { by: ADMIN_NAME, at: "Just now", text: x.status === "dismissed" ? "Flag restored for review" : "Flag dismissed after review" }] })); notify(e.status === "dismissed" ? "Flag restored — risk score recalculated" : "Flag dismissed — risk score recalculated"); };
  const addNote = (e) => { if (!note.trim()) return; update(e.id, (x) => ({ ...x, notes: [...x.notes, { by: ADMIN_NAME, at: "Just now", text: note.trim() }] })); setNote(""); notify("Note added to evidence record"); };
  const famStats = (k) => { const fe = ivEv.filter((e) => e.family === k); const act = fe.filter((e) => e.status === "active"); return { total: fe.length, active: act.length, contrib: Math.round(act.reduce((a, e) => a + contribution(e), 0)) }; };

  return (
    <>
      <div className="ch-page-head">
        <div><div className="ch-crumb">Module A · Interview Integrity</div><h1 className="ch-page-title">Integrity Monitoring</h1><div className="ch-page-sub">Explainable risk signals for human review. Nothing is decided automatically — a high score means “look closer”.</div></div>
        <div className="row wrap">
          <select className="inp" style={{ width: 320 }} value={selId} onChange={(e) => { setSelId(e.target.value); setOpenEv(null); }}>
            {sorted.map((m) => { const r = computeRisk(events.filter((e) => e.iid === m.id)); return <option key={m.id} value={m.id}>{m.candidate.name} · {m.id} · {riskLevel(r)} {r}</option>; })}
          </select>
        </div>
      </div>
      <div className="banner warn mb-16"><Icon name="info" size={18} /><div><b>Prototype notice:</b> all monitoring data on this page is simulated for demonstration. No real cheating detection, face recognition or audio analysis is performed.</div></div>

      <div className="grid g-main mb-16">
        <Card noBody>
          <div style={{ padding: 20 }} className="row wrap">
            <div style={{ flex: "1 1 240px" }}><Gauge value={risk} size={240} /></div>
            <div style={{ flex: "2 1 300px" }}>
              <div className="row between wrap mb-12"><Person name={iv.candidate.name} sub={`${iv.role} · ${fmtDate(iv.date, { day: "numeric", month: "short" })}, ${fmtTime(iv.time)}`} size={42} />{isLive ? <MonitoringIndicator label="Live monitoring" /> : <Badge tone="gray"><Icon name="history" size={12} />Post-interview review</Badge>}</div>
              <div className="grid g-3" style={{ gap: 10 }}>
                {[["Active flags", ivEv.filter((e) => e.status === "active").length, "var(--red)"], ["Dismissed", ivEv.filter((e) => e.status === "dismissed").length, "var(--muted)"], ["Avg. confidence", ivEv.length ? Math.round((ivEv.reduce((a, e) => a + e.conf, 0) / ivEv.length) * 100) + "%" : "—", "var(--purple)"]].map(([l, v, c]) => (
                  <div key={l} className="answer" style={{ padding: 12 }}><div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div><div className="xs muted">{l}</div></div>
                ))}
              </div>
              <div className="mt-12 small muted"><b style={{ color: "var(--text)" }}>Scoring model v1:</b> Risk = Σ (weight × severity × confidence), capped at 100. Hard rules override (e.g. second face &gt; 10 s → instant HIGH). Dismissed flags are excluded.</div>
              <div className="row mt-12 wrap" style={{ gap: 8 }}>
                <Badge tone={iv.consent ? "green" : "amber"}><Icon name="shieldCheck" size={12} />Consent {iv.consent ? "recorded" : "pending"}</Badge>
                <Badge tone="gray"><Icon name="lock" size={12} />Clips retained {settings.retention} days</Badge>
                <Btn size="sm" variant="ghost" iconRight="arrowRight" onClick={() => go("reports", { reportId: iv.id })}>Scorecard</Btn>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Risk levels" icon="layers">
          {[["LOW", "0–30", "green", "Normal interview noise. No action needed."], ["MEDIUM", "31–60", "amber", "Review evidence clips before sign-off."], ["HIGH", "61–100", "red", "Interviewer must review every flag; consider a follow-up interview."]].map(([l, r, t, d]) => (
            <div key={l} className="row" style={{ alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--border-2)", opacity: riskLevel(risk) === l ? 1 : 0.55 }}>
              <Badge tone={t}>{l}</Badge><div style={{ flex: 1 }}><div className="small bold">{r}</div><div className="xs muted">{d}</div></div>{riskLevel(risk) === l && <Icon name="check" size={16} style={{ color: `var(--${t})` }} />}
            </div>
          ))}
          <div className="xs muted mt-12">The final hiring decision always remains with the human interviewer.</div>
        </Card>
      </div>

      <div className="grid g-5 mb-16">
        {FAMILY_KEYS.map((k) => { const F = FAMILIES[k]; const s = famStats(k); const enabled = settings.signals[k]; return (
          <div key={k} className={`card fam-card ${fam === k ? "sel" : ""}`} onClick={() => setFam(fam === k ? "All" : k)}>
            <div className="row between"><div className="fam-ic" style={{ background: F.bg, color: F.color }}><Icon name={F.icon} size={17} /></div>{!enabled ? <Badge>Off</Badge> : s.active ? <Badge tone="red">{s.active} active</Badge> : <Badge tone="green"><Icon name="check" size={11} />Clear</Badge>}</div>
            <div className="bold mt-12">{F.label}</div>
            <div className="xs muted mb-12">Weight: {F.wLabel} · +{s.contrib} pts</div>
            {F.signals.map((sg) => { const n = ivEv.filter((e) => e.signal === sg && e.status === "active").length; return <div key={sg} className="sig-line"><span>{sg}</span>{n ? <b style={{ color: "var(--red)" }}>{n}</b> : <Icon name="check" size={13} style={{ color: "var(--green)" }} />}</div>; })}
          </div>
        ); })}
      </div>

      <Card title="Integrity Event Timeline" icon="clock" subtitle="Click a marker to view evidence" className="mb-16">
        {ivEv.length === 0 ? <div className="small muted" style={{ textAlign: "center", padding: 16 }}>No events recorded for this interview.</div> : (
          <>
            <div className="track"><div className="track-line" />
              {ivEv.map((e) => <div key={e.id} className={`track-mark ${e.status === "dismissed" ? "dis" : ""}`} title={`${e.ts} · ${e.signal}`} style={{ left: `${(tsToSec(e.ts) / durSec) * 100}%`, background: FAMILIES[e.family].color }} onClick={() => setOpenEv(e.id)}><Icon name={FAMILIES[e.family].icon} size={12} stroke={2.4} /></div>)}
            </div>
            <div className="track-ticks">{[0, 0.25, 0.5, 0.75, 1].map((p) => <span key={p}>{fmtClock(Math.round(durSec * p)).slice(3)}</span>)}</div>
            <div className="legend mt-12">{FAMILY_KEYS.map((k) => <span key={k}><i style={{ background: FAMILIES[k].color, borderRadius: "50%" }} />{k}</span>)}<span><i style={{ background: "#ccc", borderRadius: "50%", opacity: 0.4 }} />Dismissed</span></div>
          </>
        )}
      </Card>

      <Card title="Detection History" icon="history" noBody>
        <div className="toolbar">
          <SearchBox value={q} onChange={setQ} placeholder="Search signals…" />
          <select className="inp inp-sm" style={{ width: "auto" }} value={fam} onChange={(e) => setFam(e.target.value)}><option value="All">All categories</option>{FAMILY_KEYS.map((k) => <option key={k} value={k}>{FAMILIES[k].label}</option>)}</select>
          <div className="seg">{["All", "active", "dismissed"].map((s) => <button key={s} className={st === s ? "active" : ""} onClick={() => setSt(s)}>{s === "All" ? "All" : s[0].toUpperCase() + s.slice(1)}</button>)}</div>
        </div>
        {list.length === 0 ? <EmptyState icon="shieldCheck" title="No matching detections" text={ivEv.length ? "Try a different filter." : "This interview has no integrity events."} /> : (
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Time</th><th>Signal</th><th>Category</th><th>Severity</th><th>Confidence</th><th>Contribution</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead><tbody>
            {list.map((e) => { const F = FAMILIES[e.family]; return (
              <tr key={e.id} className="click" onClick={() => setOpenEv(e.id)} style={{ opacity: e.status === "dismissed" ? 0.6 : 1 }}>
                <td className="mono">{e.ts}</td>
                <td><div className="bold small">{e.signal}{e.hard && <Badge tone="red" style={{ marginLeft: 6 }}>Hard rule</Badge>}</div><div className="xs muted" style={{ maxWidth: 340 }}>{e.desc}</div></td>
                <td><span className="row small" style={{ gap: 6, color: F.color, fontWeight: 600 }}><Icon name={F.icon} size={14} />{e.family}</span></td>
                <td><Badge tone={e.sev === 3 ? "red" : e.sev === 2 ? "amber" : "gray"}>{sevLabel(e.sev)}</Badge></td>
                <td style={{ minWidth: 120 }}><div className="row" style={{ gap: 8 }}><div style={{ flex: 1 }}><ProgressBar value={e.conf * 100} color={F.color} /></div><span className="small bold">{Math.round(e.conf * 100)}%</span></div></td>
                <td className="small">{e.status === "dismissed" ? <span className="faint">0</span> : `+${contribution(e)}`}</td>
                <td>{e.status === "active" ? <Badge tone="red" dot>Active</Badge> : <Badge>Dismissed</Badge>}</td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }} onClick={(x) => x.stopPropagation()}>
                  <button className="icon-act" title="View evidence" onClick={() => setOpenEv(e.id)}><Icon name="eye" size={16} /></button>
                  <button className="icon-act" title={e.status === "dismissed" ? "Restore flag" : "Dismiss flag"} onClick={() => dismiss(e)}><Icon name={e.status === "dismissed" ? "refresh" : "x"} size={16} /></button>
                </td>
              </tr>
            ); })}
          </tbody></table></div>
        )}
      </Card>

      {evOpen && (
        <>
          <div className="drawer-ov" onClick={() => setOpenEv(null)} />
          <div className="drawer">
            <div className="modal-head"><div><div className="row" style={{ gap: 8 }}><div className="fam-ic" style={{ background: FAMILIES[evOpen.family].bg, color: FAMILIES[evOpen.family].color }}><Icon name={FAMILIES[evOpen.family].icon} size={16} /></div><div><div className="modal-title">{evOpen.signal}</div><div className="small muted">{evOpen.id} · {FAMILIES[evOpen.family].label} · {evOpen.ts}</div></div></div></div><button className="icon-act" onClick={() => setOpenEv(null)}><Icon name="x" /></button></div>
            <div className="modal-body" style={{ flex: 1 }}>
              <div className="row wrap mb-16" style={{ gap: 6 }}>{evOpen.status === "active" ? <Badge tone="red" dot>Active</Badge> : <Badge>Dismissed</Badge>}<Badge tone={evOpen.sev === 3 ? "red" : evOpen.sev === 2 ? "amber" : "gray"}>Severity: {sevLabel(evOpen.sev)}</Badge>{evOpen.hard && <Badge tone="red">Hard rule</Badge>}</div>
              <div className="section-title">Evidence</div>
              <EvidenceView e={evOpen} />
              <div className="section-title mt-20">Why this was flagged</div>
              <div className="answer">{evOpen.desc}{evOpen.rule && <div className="mt-8"><b>Rule:</b> {evOpen.rule}</div>}</div>
              <div className="grid g-3 mt-12" style={{ gap: 10 }}>
                <div className="answer" style={{ padding: 10 }}><div className="xs muted">Confidence</div><div className="bold">{Math.round(evOpen.conf * 100)}%</div></div>
                <div className="answer" style={{ padding: 10 }}><div className="xs muted">Family weight</div><div className="bold">{FAMILIES[evOpen.family].weight} ({FAMILIES[evOpen.family].wLabel})</div></div>
                <div className="answer" style={{ padding: 10 }}><div className="xs muted">Risk contribution</div><div className="bold">{evOpen.status === "dismissed" ? 0 : `+${contribution(evOpen)}`}</div></div>
              </div>
              <div className="xs muted mt-8">Detection method: {FAMILIES[evOpen.family].how}. Contribution = weight × severity × confidence.</div>
              <div className="section-title mt-20">Reviewer notes</div>
              {evOpen.notes.length === 0 && <div className="small muted mb-12">No notes yet.</div>}
              {evOpen.notes.map((n, i) => <div key={i} className="row mb-12" style={{ alignItems: "flex-start" }}><Avatar name={n.by} size={28} /><div><div className="small"><b>{n.by}</b> <span className="faint xs">· {n.at}</span></div><div className="small">{n.text}</div></div></div>)}
              <textarea className="inp" placeholder="Add context, e.g. 'Candidate explained they were reading the question from the shared doc'" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="modal-foot"><Btn variant="secondary" icon="note" disabled={!note.trim()} onClick={() => addNote(evOpen)}>Add note</Btn><Btn variant={evOpen.status === "dismissed" ? "secondary" : "soft-danger"} icon={evOpen.status === "dismissed" ? "refresh" : "x"} onClick={() => dismiss(evOpen)}>{evOpen.status === "dismissed" ? "Restore flag" : "Dismiss flag"}</Btn></div>
          </div>
        </>
      )}
    </>
  );
}

/* ============================================================================
   PAGE: AI EVALUATION
   ========================================================================== */
function highlight(text, needles) {
  const ns = needles.filter(Boolean); if (!ns.length) return text;
  const lower = text.toLowerCase(); let idx = -1, len = 0;
  for (const n of ns) { const i = lower.indexOf(n.toLowerCase()); if (i >= 0) { idx = i; len = n.length; break; } }
  if (idx < 0) return text;
  return <>{text.slice(0, idx)}<mark>{text.slice(idx, idx + len)}</mark>{highlight(text.slice(idx + len), ns)}</>;
}

function EvaluationPage({ interviews, evals, setEvals, events, weights, notify, confirm, ctx, go, users }) {
  const done = interviews.filter((i) => i.status === "Completed" && evals[i.id]).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const [selId, setSelId] = useState(ctx.evalId && evals[ctx.evalId] ? ctx.evalId : done[0]?.id);
  const [tab, setTab] = useState("scoring"); const [tq, setTq] = useState(""); const [speaker, setSpeaker] = useState("All");
  const iv = interviews.find((i) => i.id === selId); const ev = evals[selId];
  if (!iv || !ev) return <><div className="ch-page-head"><div><div className="ch-crumb">Module B · AI-assisted Evaluation</div><h1 className="ch-page-title">AI Evaluation</h1></div></div><Card><EmptyState icon="sparkles" title="No evaluations yet" text="Evaluations are drafted automatically after an interview ends." /></Card></>;
  const locked = ev.signedOff;
  const upd = (fn) => setEvals((p) => ({ ...p, [selId]: fn(p[selId]) }));
  const score = overallScore(ev, weights); const aiScore = Math.round(DIMS.reduce((a, d) => a + (weights[d.key] / 100) * (ev.dims[d.key].ai / 5) * 100, 0));
  const aiRec = recFromScore(aiScore); const risk = computeRisk(events.filter((e) => e.iid === selId));
  const missingReasons = DIMS.filter((d) => ev.dims[d.key].override != null && !ev.dims[d.key].reason.trim()).length + ev.questions.filter((q) => q.override != null && !q.reason.trim()).length;
  const lines = ev.transcript.filter((l) => (speaker === "All" || l.sp === speaker) && (!tq || l.text.toLowerCase().includes(tq.toLowerCase())));
  const signOff = () => {
    if (!ev.decision) { notify("Select a final recommendation first", "warn"); setTab("review"); return; }
    if (missingReasons) { notify(`Add a reason for ${missingReasons} manual override(s) before sign-off`, "warn"); return; }
    confirm({ title: "Sign off scorecard?", message: `You are confirming "${ev.decision}" for ${iv.candidate.name} as the human decision-maker. The AI score (${aiScore}) and your final score (${score}) will both be stored for audit.`, confirmLabel: "Sign off", onConfirm: () => { upd((e) => ({ ...e, signedOff: true, signedBy: ADMIN_NAME, signedAt: TODAY })); notify("Scorecard signed off and shared with the hiring panel"); } });
  };

  return (
    <>
      <div className="ch-page-head">
        <div><div className="ch-crumb">Module B · AI-assisted Evaluation</div><h1 className="ch-page-title">AI Evaluation</h1><div className="ch-page-sub">Rubric-driven AI draft · the interviewer reviews, overrides and makes the final call.</div></div>
        <div className="row wrap">
          <select className="inp" style={{ width: 300 }} value={selId} onChange={(e) => setSelId(e.target.value)}>{done.map((d) => <option key={d.id} value={d.id}>{d.candidate.name} · {d.id}{evals[d.id].signedOff ? " ✓" : ""}</option>)}</select>
          <Btn variant="secondary" icon="file" onClick={() => go("reports", { reportId: selId })}>Scorecard</Btn>
        </div>
      </div>

      <div className="card mb-16" style={{ padding: 20 }}>
        <div className="row wrap" style={{ gap: 24 }}>
          <div className="row" style={{ gap: 14, flex: "1 1 260px" }}><Avatar name={iv.candidate.name} size={56} /><div><div style={{ fontSize: 18, fontWeight: 700 }}>{iv.candidate.name}</div><div className="small muted">{iv.role} · {fmtDate(iv.date)} · Interviewer: {userById(iv.interviewer, users).name}</div><div className="row mt-8 wrap" style={{ gap: 6 }}><RiskBadge score={risk} />{locked ? <Badge tone="green"><Icon name="lock" size={11} />Signed off by {ev.signedBy}</Badge> : <Badge tone="amber" dot>Awaiting human review</Badge>}</div></div></div>
          <div className="row" style={{ gap: 14 }}><ScoreRing value={score} size={96} /><div><div className="xs muted bold">FINAL WEIGHTED SCORE</div><div className="small muted">AI draft: <b>{aiScore}</b>{score !== aiScore && <span style={{ color: "var(--purple)" }}> → {score} after overrides</span>}</div></div></div>
          <div className="col" style={{ gap: 6, alignItems: "flex-start" }}><div className="xs muted bold">AI SUGGESTION</div><RecBadge rec={aiRec} /><div className="xs muted bold mt-8">FINAL DECISION (HUMAN)</div>{ev.decision ? <RecBadge rec={ev.decision} /> : <Badge>Not decided</Badge>}</div>
        </div>
      </div>
      <div className="banner info mb-16"><Icon name="sparkles" size={18} /><div className="small"><b>AI-assisted draft</b> — fixed prompt & rubric per role, temperature 0, PII stripped before scoring. Every AI score quotes the transcript line that justifies it. <b>The AI never rejects candidates</b>; the interviewer makes the final decision.</div></div>

      <Tabs value={tab} onChange={setTab} tabs={[{ key: "scoring", label: "Scoring dimensions", icon: "scale" }, { key: "questions", label: "Question-wise scores", icon: "book", count: ev.questions.length }, { key: "transcript", label: "Transcript", icon: "message" }, { key: "review", label: "Review & decision", icon: "check" }]} />

      {tab === "scoring" && (
        <div className="grid g-main">
          <Card title="Weighted dimensions" subtitle="Scale 1–5 · weights configurable in Settings" icon="scale">
            <div className="dim-row xs muted bold" style={{ paddingTop: 0 }}><span>DIMENSION</span><span>WEIGHT</span><span>AI SCORE</span><span>OVERRIDE</span><span className="hide-md">REASON</span></div>
            {DIMS.map((d) => { const o = ev.dims[d.key]; return (
              <div key={d.key} className="dim-row">
                <div><div className="bold">{d.label}</div><div className="xs muted">{d.looks}</div></div>
                <div><Badge tone="navy">{weights[d.key]}%</Badge></div>
                <div className="row" style={{ gap: 8 }}><ScorePill value={o.ai} /><Dots value={o.ai} /></div>
                <select className="inp inp-sm" disabled={locked} value={o.override ?? ""} onChange={(e) => upd((x) => ({ ...x, dims: { ...x.dims, [d.key]: { ...o, override: e.target.value === "" ? null : Number(e.target.value) } } }))}><option value="">Keep AI ({o.ai})</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select>
                <div className="hide-md">{o.override != null ? <input className={`inp inp-sm ${!o.reason.trim() ? "invalid" : ""}`} disabled={locked} placeholder="Reason (required)" value={o.reason} onChange={(e) => upd((x) => ({ ...x, dims: { ...x.dims, [d.key]: { ...o, reason: e.target.value } } }))} /> : <span className="xs faint">—</span>}</div>
              </div>
            ); })}
          </Card>
          <Card title="AI vs. final" icon="trend">
            {DIMS.map((d) => { const o = ev.dims[d.key]; return (
              <div key={d.key} className="mb-16">
                <div className="row between small mb-12" style={{ marginBottom: 6 }}><b>{d.label}</b><span className="muted">{o.ai} → <b style={{ color: "var(--text)" }}>{finalVal(o)}</b></span></div>
                <ProgressBar value={(o.ai / 5) * 100} color="#C9C2FA" /><div style={{ height: 5 }} /><ProgressBar value={(finalVal(o) / 5) * 100} color="var(--navy-700)" />
              </div>
            ); })}
            <div className="legend"><span><i style={{ background: "#C9C2FA" }} />AI draft</span><span><i style={{ background: "var(--navy-700)" }} />Final (after review)</span></div>
            <div className="divider" />
            <div className="row between"><span className="small muted">Overall</span><span style={{ fontSize: 22, fontWeight: 800 }}>{score}<span className="small muted"> / 100</span></span></div>
          </Card>
        </div>
      )}

      {tab === "questions" && ev.questions.map((q, i) => (
        <div key={q.qid} className="q-card">
          <div className="row between wrap mb-12">
            <div className="row wrap" style={{ gap: 6 }}><Badge tone="navy">Q{i + 1}</Badge><span className="mono faint">{q.qid}</span><span className="tag">{DIMS.find((d) => d.key === q.dim)?.label}</span><span className="xs muted mono">{q.ts}</span></div>
            <div className="row" style={{ gap: 8 }}><span className="xs muted bold">AI SCORE</span><ScorePill value={q.ai} />{q.override != null && <><Icon name="arrowRight" size={14} /><ScorePill value={q.override} /></>}</div>
          </div>
          <div className="bold mb-12">{q.question}</div>
          <div className="grid g-2" style={{ gap: 14 }}>
            <div><div className="section-title">Candidate answer</div><div className="answer">{highlight(q.answer, [q.evidence])}</div></div>
            <div>
              <div className="section-title">Evidence quote</div><div className="quote">“{q.evidence}”</div>
              <div className="section-title mt-12">AI feedback</div><div className="small" style={{ color: "var(--text-2)" }}>{q.feedback}</div>
            </div>
          </div>
          <div className="divider" />
          <div className="row wrap" style={{ gap: 10 }}>
            <span className="small bold">Manual override</span>
            <select className="inp inp-sm" style={{ width: 150 }} disabled={locked} value={q.override ?? ""} onChange={(e) => upd((x) => ({ ...x, questions: x.questions.map((y) => (y.qid === q.qid ? { ...y, override: e.target.value === "" ? null : Number(e.target.value) } : y)) }))}><option value="">Keep AI ({q.ai})</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select>
            {q.override != null && <input className={`inp inp-sm ${!q.reason.trim() ? "invalid" : ""}`} style={{ flex: 1, minWidth: 200 }} disabled={locked} placeholder="Reason for override (required, stored for audit & drift checks)" value={q.reason} onChange={(e) => upd((x) => ({ ...x, questions: x.questions.map((y) => (y.qid === q.qid ? { ...y, reason: e.target.value } : y)) }))} />}
            <Btn size="sm" variant="ghost" icon="message" onClick={() => { setTab("transcript"); setTq(q.evidence.split(" ").slice(0, 4).join(" ")); }}>Find in transcript</Btn>
          </div>
        </div>
      ))}

      {tab === "transcript" && (
        <Card noBody>
          <div className="toolbar"><SearchBox value={tq} onChange={setTq} placeholder="Search transcript…" /><div className="seg">{["All", "Interviewer", "Candidate"].map((s) => <button key={s} className={speaker === s ? "active" : ""} onClick={() => setSpeaker(s)}>{s}</button>)}</div><span className="small muted" style={{ marginLeft: "auto" }}><mark>Highlighted</mark> = evidence used by AI</span></div>
          <div style={{ padding: "6px 20px 16px" }}>
            {lines.length === 0 ? <EmptyState icon="message" title="No lines match" text="Try a different search term." /> : lines.map((l, i) => (
              <div key={i} className="tr-line" style={{ borderBottom: "1px solid var(--border-2)" }}>
                <span className="ts">{l.t}</span>
                <Avatar name={l.sp === "Candidate" ? iv.candidate.name : userById(iv.interviewer, users).name} size={28} />
                <div style={{ flex: 1 }}><div className="xs bold" style={{ color: l.sp === "Candidate" ? "var(--purple-600)" : "var(--navy-700)" }}>{l.sp === "Candidate" ? iv.candidate.name : userById(iv.interviewer, users).name} · {l.sp}</div><div className="small">{highlight(l.text, [tq, l.evidence])}</div></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "review" && (
        <div className="grid g-main">
          <div className="col" style={{ gap: 18 }}>
            <Card title="Interviewer review" icon="edit" subtitle="Your written assessment — included in the scorecard">
              {ev.liveNotes && <><div className="section-title">Live notes from interview room</div><div className="answer mb-16" style={{ whiteSpace: "pre-wrap" }}>{ev.liveNotes}</div></>}
              <textarea className="inp" style={{ minHeight: 140 }} disabled={locked} value={ev.review} placeholder="Summarise strengths, concerns and how you weighed the integrity flags…" onChange={(e) => upd((x) => ({ ...x, review: e.target.value }))} />
            </Card>
            <Card title="Final recommendation" icon="flag" subtitle="Selected by the interviewer — AI suggestion is advisory only">
              <div className="grid g-4" style={{ gap: 10 }}>
                {["Strong Hire", "Hire", "Hold", "No Hire"].map((r) => (
                  <button key={r} className={`rec-opt ${ev.decision === r ? "sel" : ""}`} disabled={locked} onClick={() => upd((x) => ({ ...x, decision: r }))}>
                    {aiRec === r && <span className="ai-tag">AI suggests</span>}
                    <Badge tone={REC_TONE[r]}>{r}</Badge>
                    <div className="xs muted mt-8">{{ "Strong Hire": "Score ≥ 85, clear evidence", Hire: "Score 70–84", Hold: "Score 55–69 or open questions", "No Hire": "Score < 55" }[r]}</div>
                  </button>
                ))}
              </div>
              {risk > 60 && <div className="banner danger mt-16"><Icon name="alert" size={18} /><div className="small">This interview has a <b>HIGH integrity risk ({risk})</b>. Review the evidence before deciding — consider a follow-up interview rather than rejecting on flags alone.<div className="mt-8"><Btn size="sm" variant="secondary" onClick={() => go("integrity", { integrityId: selId })}>Review integrity evidence</Btn></div></div></div>}
            </Card>
          </div>
          <Card title="Sign-off" icon="lock">
            <dl className="kv" style={{ gridTemplateColumns: "1fr auto" }}>
              <dt>AI draft score</dt><dd>{aiScore}</dd><dt>Final score</dt><dd>{score}</dd><dt>Overrides</dt><dd>{DIMS.filter((d) => ev.dims[d.key].override != null).length + ev.questions.filter((q) => q.override != null).length}</dd>
              <dt>Missing override reasons</dt><dd style={{ color: missingReasons ? "var(--red)" : undefined }}>{missingReasons}</dd><dt>Integrity risk</dt><dd><RiskBadge score={risk} /></dd><dt>Decision</dt><dd>{ev.decision ? <RecBadge rec={ev.decision} /> : "—"}</dd>
            </dl>
            <div className="divider" />
            {locked ? (
              <><div className="banner ok"><Icon name="check" size={18} /><div className="small">Signed off by <b>{ev.signedBy}</b> on {fmtDate(ev.signedAt)}.</div></div>
                <div className="row mt-12"><Btn variant="secondary" icon="file" onClick={() => go("reports", { reportId: selId })}>View scorecard</Btn><Btn variant="ghost" icon="refresh" onClick={() => confirm({ title: "Reopen evaluation?", message: "The scorecard will return to draft and the hiring panel will be notified.", confirmLabel: "Reopen", onConfirm: () => { upd((x) => ({ ...x, signedOff: false })); notify("Evaluation reopened for editing", "info"); } })}>Reopen</Btn></div></>
            ) : <Btn className="mt-8" icon="check" onClick={signOff} style={{ width: "100%" }}>Sign off as final decision</Btn>}
            <div className="xs muted mt-12">Overrides are logged and compared weekly against AI scores to detect drift.</div>
          </Card>
        </div>
      )}
    </>
  );
}

/* ============================================================================
   PAGE: SCORECARDS & REPORTS
   ========================================================================== */
function ReportsPage({ interviews, evals, events, weights, ctx, go, notify, users, org }) {
  const done = interviews.filter((i) => i.status === "Completed" && evals[i.id]).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const [selId, setSelId] = useState(ctx.reportId && evals[ctx.reportId] ? ctx.reportId : done[0]?.id);
  const [search, setSearch] = useState(""); const [rec, setRec] = useState("All"); const [gen, setGen] = useState(0);
  const recOf = (id) => evals[id].signedOff ? evals[id].decision : recFromScore(overallScore(evals[id], weights));
  const list = done.filter((d) => (!search || d.candidate.name.toLowerCase().includes(search.toLowerCase()) || d.role.toLowerCase().includes(search.toLowerCase())) && (rec === "All" || recOf(d.id) === rec));
  const iv = interviews.find((i) => i.id === selId); const ev = evals[selId];
  useEffect(() => { if (!gen || gen >= 100) return; const t = setTimeout(() => setGen((g) => Math.min(100, g + 20)), 220); return () => clearTimeout(t); }, [gen]);

  if (!iv || !ev) return <><div className="ch-page-head"><div><div className="ch-crumb">Scorecards & Reports</div><h1 className="ch-page-title">Scorecards</h1></div></div><Card><EmptyState icon="file" title="No scorecards yet" text="Scorecards appear after interviews are completed." /></Card></>;
  const score = overallScore(ev, weights); const ivEv = events.filter((e) => e.iid === selId); const risk = computeRisk(ivEv);
  const interviewerName = userById(iv.interviewer, users).name;
  const timeline = [...ev.questions.map((q, i) => ({ t: q.ts, kind: "q", label: `Q${i + 1} answered · AI ${q.ai}/5${q.override != null ? ` → ${q.override}/5` : ""}`, sub: q.question })), ...ivEv.map((e) => ({ t: e.ts, kind: "e", e, label: `${e.signal} (${Math.round(e.conf * 100)}%)`, sub: e.desc }))].sort((a, b) => a.t.localeCompare(b.t));

  const makePdf = () => {
    setGen(5);
    setTimeout(() => {
      const B = [];
      B.push({ text: `${org.name.toUpperCase()} - INTERVIEW SCORECARD`, size: 9, bold: true, color: "0.42 0.36 0.9" });
      B.push({ text: `${iv.candidate.name}`, size: 20, bold: true, space: 6 });
      B.push({ text: `${iv.role} - ${iv.id} - ${fmtDate(iv.date)} ${fmtTime(iv.time)} - Interviewer: ${interviewerName}`, size: 10, rule: true });
      B.push({ text: `Overall weighted score: ${score} / 100`, size: 14, bold: true, space: 6 });
      B.push({ text: `Recommendation: ${ev.signedOff ? ev.decision + " (signed off by " + ev.signedBy + ")" : "AI draft " + recFromScore(score) + " - pending human sign-off"}`, size: 11 });
      B.push({ text: `Integrity risk: ${riskLevel(risk)} (${risk}/100) - ${ivEv.filter((e) => e.status === "active").length} active flags, ${ivEv.filter((e) => e.status === "dismissed").length} dismissed`, size: 11, rule: true });
      B.push({ text: "SCORING DIMENSIONS", size: 10, bold: true, space: 6 });
      DIMS.forEach((d) => B.push({ text: `${d.label} (${weights[d.key]}%): AI ${ev.dims[d.key].ai}/5, final ${finalVal(ev.dims[d.key])}/5${ev.dims[d.key].reason ? " - " + ev.dims[d.key].reason : ""}`, size: 10, indent: 10 }));
      B.push({ text: "QUESTION SCORES", size: 10, bold: true, space: 10 });
      ev.questions.forEach((q, i) => { B.push({ text: `Q${i + 1}. ${q.question}`, size: 10, bold: true, space: 4 }); B.push({ text: `Score: AI ${q.ai}/5${q.override != null ? `, override ${q.override}/5 (${q.reason})` : ""}`, size: 9.5, indent: 12 }); B.push({ text: `Evidence: "${q.evidence}" [${q.ts}]`, size: 9.5, indent: 12 }); B.push({ text: `AI feedback: ${q.feedback}`, size: 9.5, indent: 12 }); });
      B.push({ text: "INTEGRITY EVIDENCE TIMELINE", size: 10, bold: true, space: 10 });
      if (!ivEv.length) B.push({ text: "No integrity events recorded.", size: 9.5, indent: 10 });
      ivEv.forEach((e) => B.push({ text: `${e.ts}  ${e.family} / ${e.signal} - ${Math.round(e.conf * 100)}% - ${e.status}${e.notes.length ? " - note: " + e.notes[e.notes.length - 1].text : ""}`, size: 9.5, indent: 10 }));
      B.push({ text: "INTERVIEWER COMMENTS", size: 10, bold: true, space: 10 });
      B.push({ text: ev.review || "No comments recorded yet.", size: 10, indent: 10 });
      B.push({ text: "AI scores are advisory. The final hiring decision is made by the human interviewer. Integrity signals in this prototype are simulated.", size: 8.5, space: 14, color: "0.45 0.48 0.58" });
      const ok = downloadBlob(buildPdf(B), `${iv.candidate.name.replace(/\s+/g, "_")}_${iv.id}_Scorecard.pdf`);
      setGen(100); notify(ok ? "Scorecard PDF generated and downloaded" : "PDF generated (download blocked by browser sandbox)", ok ? "success" : "info");
    }, 1100);
  };

  return (
    <>
      <div className="ch-page-head">
        <div><div className="ch-crumb">Scorecards & Reports</div><h1 className="ch-page-title">Scorecards</h1><div className="ch-page-sub">One shareable report per candidate: scores, evidence, integrity timeline and the human decision.</div></div>
      </div>
      <div className="grid g-side">
        <Card noBody style={{ alignSelf: "start" }}>
          <div className="toolbar" style={{ flexDirection: "column", alignItems: "stretch" }}>
            <SearchBox value={search} onChange={setSearch} placeholder="Search candidates…" />
            <select className="inp inp-sm" value={rec} onChange={(e) => setRec(e.target.value)}><option value="All">All recommendations</option>{["Strong Hire", "Hire", "Hold", "No Hire"].map((r) => <option key={r}>{r}</option>)}</select>
          </div>
          {list.length === 0 ? <EmptyState icon="file" title="No scorecards" text="No candidates match." /> : list.map((d) => { const s = overallScore(evals[d.id], weights); const r = computeRisk(events.filter((e) => e.iid === d.id)); return (
            <div key={d.id} className={`sc-item ${d.id === selId ? "sel" : ""}`} onClick={() => { setSelId(d.id); setGen(0); }}>
              <Avatar name={d.candidate.name} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}><div className="bold small ellipsis">{d.candidate.name}</div><div className="xs muted ellipsis">{d.role}</div><div className="row mt-8" style={{ gap: 4 }}><RecBadge rec={recOf(d.id)} prefix={evals[d.id].signedOff ? "" : "AI: "} /><Badge tone={riskTone(r)}>{riskLevel(r)}</Badge></div></div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{s}</div>
            </div>
          ); })}
        </Card>

        <div className="card" style={{ minWidth: 0 }}>
          <div className="report-hero">
            <div className="row between wrap" style={{ gap: 16 }}>
              <div className="row" style={{ gap: 14 }}><Avatar name={iv.candidate.name} size={56} /><div><div className="xs" style={{ opacity: 0.7, letterSpacing: 1, fontWeight: 600 }}>CANDIDATE SCORECARD · {iv.id}</div><div style={{ fontSize: 22, fontWeight: 750 }}>{iv.candidate.name}</div><div className="small" style={{ opacity: 0.8 }}>{iv.role} · {fmtDate(iv.date)} · Interviewer: {interviewerName}</div></div></div>
              <div className="row" style={{ gap: 18 }}>
                <ScoreRing value={score} size={92} dark />
                <div><div className="xs" style={{ opacity: 0.7, fontWeight: 600 }}>RECOMMENDATION</div>{ev.signedOff ? <Badge tone={REC_TONE[ev.decision]} style={{ fontSize: 13, padding: "5px 12px", marginTop: 4 }}>{ev.decision}</Badge> : <><Badge tone="gray" style={{ marginTop: 4 }}>AI draft: {recFromScore(score)}</Badge><div className="xs" style={{ opacity: 0.75, marginTop: 4 }}>Pending human sign-off</div></>}</div>
              </div>
            </div>
            <div className="row wrap mt-16" style={{ gap: 8 }}>
              <Btn variant="primary" icon="download" onClick={makePdf} disabled={gen > 0 && gen < 100}>{gen > 0 && gen < 100 ? `Generating… ${gen}%` : "Generate & download PDF"}</Btn>
              <Btn variant="secondary" icon="share" onClick={() => { copyText(`https://app.${org.domain}/scorecards/${iv.id}`); notify("Share link copied — access limited to the hiring panel"); }}>Copy share link</Btn>
              <Btn variant="secondary" icon="sparkles" onClick={() => go("evaluation", { evalId: iv.id })}>Edit evaluation</Btn>
            </div>
            {gen > 0 && gen < 100 && <div className="mt-12" style={{ maxWidth: 320 }}><ProgressBar value={gen} color="#A99FFB" /></div>}
          </div>
          <div style={{ padding: 22 }}>
            {!ev.signedOff && <div className="banner warn mb-16"><Icon name="alert" size={18} /><div className="small">This scorecard is an <b>AI-assisted draft</b>. It becomes final only after the interviewer signs off in the Evaluation module.</div></div>}
            <div className="grid g-2 mb-16">
              <div>
                <div className="section-title">Scoring dimensions</div>
                {DIMS.map((d) => <div key={d.key} className="mb-12"><div className="row between small" style={{ marginBottom: 5 }}><span><b>{d.label}</b> <span className="faint">· {weights[d.key]}%</span></span><span className="bold">{finalVal(ev.dims[d.key])}/5</span></div><ProgressBar value={(finalVal(ev.dims[d.key]) / 5) * 100} color="linear-gradient(90deg,#6C5CE7,#3366F0)" /></div>)}
              </div>
              <div>
                <div className="section-title">Integrity risk summary</div>
                <div className="row" style={{ gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 150 }}><Gauge value={risk} size={150} label={false} /></div>
                  <div className="small" style={{ flex: 1 }}><RiskBadge score={risk} />
                    {FAMILY_KEYS.map((k) => { const n = ivEv.filter((e) => e.family === k && e.status === "active").length; return <div key={k} className="row between mt-8"><span className="muted">{k}</span><b style={{ color: n ? "var(--red)" : "var(--green)" }}>{n ? `${n} flag${n > 1 ? "s" : ""}` : "Clear"}</b></div>; })}
                    <div className="xs muted mt-8">{ivEv.filter((e) => e.status === "dismissed").length} dismissed after review</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-title">Individual question scores</div>
            <div className="tbl-wrap card mb-16" style={{ boxShadow: "none" }}><table className="tbl"><thead><tr><th>#</th><th>Question</th><th>Dimension</th><th>AI</th><th>Final</th><th>Evidence</th></tr></thead><tbody>
              {ev.questions.map((q, i) => <tr key={q.qid}><td className="bold">Q{i + 1}</td><td className="small" style={{ maxWidth: 260 }}>{q.question}</td><td className="small">{DIMS.find((d) => d.key === q.dim)?.label}</td><td><ScorePill value={q.ai} /></td><td><ScorePill value={q.override ?? q.ai} /></td><td className="xs muted" style={{ maxWidth: 240, fontStyle: "italic" }}>“{q.evidence}”</td></tr>)}
            </tbody></table></div>
            <div className="grid g-2">
              <div>
                <div className="section-title">Interviewer comments</div>
                {ev.review ? <div className="answer"><div className="row mb-12" style={{ marginBottom: 8 }}><Avatar name={interviewerName} size={26} /><b className="small">{interviewerName}</b></div>{ev.review}</div> : <EmptyState icon="message" title="No comments yet" text="Add a review in the Evaluation module." action={<Btn size="sm" variant="secondary" onClick={() => go("evaluation", { evalId: iv.id })}>Add review</Btn>} />}
              </div>
              <div>
                <div className="section-title">Evidence timeline</div>
                <div className="tl" style={{ maxHeight: 320, overflowY: "auto" }}>
                  {timeline.map((t, i) => <div key={i} className="tl-item"><span className="tl-dot" style={{ background: t.kind === "q" ? "var(--navy-700)" : FAMILIES[t.e.family].color, opacity: t.kind === "e" && t.e.status === "dismissed" ? 0.4 : 1 }} /><div className="row" style={{ gap: 8 }}><span className="mono faint" style={{ fontSize: 11 }}>{t.t}</span><b className="small" style={{ textDecoration: t.kind === "e" && t.e.status === "dismissed" ? "line-through" : "none" }}>{t.label}</b></div><div className="xs muted ellipsis">{t.sub}</div></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================================
   PAGE: SETTINGS
   ========================================================================== */
function SettingsPage({ settings, setSettings, users, setUsers, notify, confirm, org, saveOrg }) {
  const [tab, setTab] = useState("org");
  const [draft, setDraft] = useState(org);
  const [orgErr, setOrgErr] = useState({});
  const dirty = JSON.stringify(draft) !== JSON.stringify(org);
  const saveOrgDraft = () => {
    const e = {};
    if (!String(draft.name || "").trim()) e.name = "Organization name is required";
    if (!String(draft.shortName || "").trim()) e.shortName = "Display name is required";
    if (draft.domain && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(draft.domain.trim())) e.domain = "Enter a valid domain, e.g. credang.ai";
    setOrgErr(e); if (Object.keys(e).length) return;
    const clean = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, String(v).trim()]));
    const persisted = saveOrg(clean); setDraft(clean);
    notify(persisted ? "Organization profile saved" : "Saved for this session (browser storage unavailable)", persisted ? "success" : "warn");
  };
  const [weights, setWeights] = useState(settings.weights);
  const [invite, setInvite] = useState(null);
  const [userQ, setUserQ] = useState("");
  const wSum = Object.values(weights).reduce((a, b) => a + Number(b || 0), 0);
  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const audit = [[ADMIN_NAME, "Dismissed flag EV-118 (Background sounds) on INT-1039", relLabel(-1, "10:52")], ["System", "Auto-deleted 14 recordings past retention window", relLabel(-2, "02:00")], ["Rohan Kapoor", "Exported candidate data for DSAR request #DS-221", relLabel(-3, "15:10")], ["David Okafor", "Signed off scorecard INT-1039 (Strong Hire)", relLabel(-1, "11:20")], [ADMIN_NAME, "Changed retention period 120 → 90 days", relLabel(-16, "09:44")]];
  const sendInvite = () => {
    if (!invite.name.trim() || !/^\S+@\S+\.\S+$/.test(invite.email)) { notify("Enter a name and valid email", "warn"); return; }
    setUsers((p) => [...p, { id: "u" + (p.length + 10), name: invite.name.trim(), email: invite.email.trim(), title: invite.title || "—", role: invite.role, status: "Invited", last: "—" }]);
    notify(`Invitation sent to ${invite.email}`); setInvite(null);
  };
  return (
    <>
      <div className="ch-page-head"><div><div className="ch-crumb">Administration</div><h1 className="ch-page-title">Settings</h1><div className="ch-page-sub">Organisation, users, interview defaults, notifications and privacy controls.</div></div></div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: "org", label: "Organization", icon: "building" }, { key: "users", label: "Users", icon: "users", count: users.length }, { key: "interview", label: "Interview settings", icon: "video" }, { key: "notif", label: "Notifications", icon: "bell" }, { key: "privacy", label: "Privacy & retention", icon: "lock" }]} />

      {tab === "org" && (
        <div className="grid g-main">
          <Card title="Organization profile" icon="building">
            <div className="row mb-16" style={{ gap: 14 }}><div className="ch-logo" style={{ width: 56, height: 56, borderRadius: 14 }}><Icon name="building" size={26} /></div><div><div className="bold">{org.name}</div><div className="small muted">Enterprise plan · SSO enabled{dirty ? " · unsaved changes" : ""}</div></div><Btn size="sm" variant="secondary" style={{ marginLeft: "auto" }} onClick={() => notify("Logo upload is simulated", "info")}>Change logo</Btn></div>
            <div className="grid g-2" style={{ gap: "0 14px" }}>
              {[["name", "Organization name (legal)"], ["shortName", "Display name"], ["domain", "Primary domain"], ["industry", "Industry"], ["size", "Company size"], ["region", "Region"], ["timezone", "Default timezone"]].map(([k, l]) => <Field key={k} label={l} error={orgErr[k]} hint={k === "shortName" ? "Shorter name shown across the app" : undefined}><input className={`inp ${orgErr[k] ? "invalid" : ""}`} value={draft[k] || ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} /></Field>)}
            </div>
            <div className="row" style={{ justifyContent: "flex-end" }}><Btn variant="ghost" onClick={() => { setDraft(ORG_DEFAULT); setOrgErr({}); }}>Restore defaults</Btn><Btn variant="secondary" disabled={!dirty} onClick={() => { setDraft(org); setOrgErr({}); }}>Discard changes</Btn><Btn icon="check" disabled={!dirty} onClick={saveOrgDraft}>Save changes</Btn></div>
          </Card>
          <Card title="Plan & usage" icon="layers">
            <dl className="kv" style={{ gridTemplateColumns: "1fr auto" }}><dt>Plan</dt><dd>Enterprise</dd><dt>Interviews this month</dt><dd>98 / 500</dd><dt>Seats</dt><dd>{users.length} / 50</dd><dt>Data region</dt><dd>{settings.region}</dd><dt>SSO</dt><dd><Badge tone="green">Enabled</Badge></dd></dl>
            <div className="mt-16"><ProgressBar value={19.6} /></div><div className="xs muted mt-8">19.6% of monthly interview quota used</div>
          </Card>
        </div>
      )}

      {tab === "users" && (
        <Card noBody>
          <div className="toolbar"><SearchBox value={userQ} onChange={setUserQ} placeholder="Search users…" /><Btn icon="plus" size="sm" style={{ marginLeft: "auto" }} onClick={() => setInvite({ name: "", email: "", title: "", role: "Interviewer" })}>Invite user</Btn></div>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>User</th><th>Title</th><th>Role</th><th>Status</th><th>Last active</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead><tbody>
            {users.filter((u) => !userQ || (u.name + u.email).toLowerCase().includes(userQ.toLowerCase())).map((u) => (
              <tr key={u.id}>
                <td><Person name={u.name} sub={u.email} /></td><td className="small">{u.title}</td>
                <td><select className="inp inp-sm" style={{ width: 140 }} value={u.role} disabled={u.id === "u1"} onChange={(e) => { setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, role: e.target.value } : x))); notify(`${u.name} is now ${e.target.value}`); }}><option>Admin</option><option>Interviewer</option><option>Recruiter</option><option>Viewer</option></select></td>
                <td><Badge tone={u.status === "Active" ? "green" : u.status === "Invited" ? "amber" : "gray"} dot>{u.status}</Badge></td>
                <td className="small muted">{u.last}</td>
                <td style={{ textAlign: "right" }}>
                  {u.status === "Invited" && <Btn size="sm" variant="ghost" onClick={() => notify(`Invitation re-sent to ${u.email}`)}>Resend</Btn>}
                  {u.id !== "u1" && <Btn size="sm" variant="ghost" onClick={() => confirm({ title: u.status === "Deactivated" ? "Reactivate user?" : "Deactivate user?", message: `${u.name} ${u.status === "Deactivated" ? "will regain" : "will lose"} access to Credang AI. Their past evaluations are kept.`, confirmLabel: u.status === "Deactivated" ? "Reactivate" : "Deactivate", danger: u.status !== "Deactivated", onConfirm: () => { setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, status: x.status === "Deactivated" ? "Active" : "Deactivated" } : x))); notify(`${u.name} ${u.status === "Deactivated" ? "reactivated" : "deactivated"}`); } })}>{u.status === "Deactivated" ? "Reactivate" : "Deactivate"}</Btn>}
                  {u.id === "u1" && <span className="xs muted">You</span>}
                </td>
              </tr>
            ))}
          </tbody></table></div>
        </Card>
      )}

      {tab === "interview" && (
        <div className="grid g-2">
          <Card title="Interview defaults" icon="video">
            <SetRow title="Default duration" desc="Applied to newly scheduled interviews"><select className="inp inp-sm" style={{ width: 130 }} value={settings.duration} onChange={(e) => set("duration", Number(e.target.value))}>{[30, 45, 60, 90].map((d) => <option key={d} value={d}>{d} min</option>)}</select></SetRow>
            <SetRow title="Candidate link expiry"><select className="inp inp-sm" style={{ width: 130 }} value={settings.linkExpiry} onChange={(e) => set("linkExpiry", e.target.value)}><option value="24h">24 hours</option><option value="48h">48 hours</option><option value="7d">7 days</option></select></SetRow>
            <SetRow title="Record audio & video" desc="Required for transcript-based evaluation"><Toggle checked={settings.recording} onChange={(v) => set("recording", v)} /></SetRow>
            <SetRow title="Automatic transcription" desc="Speaker-labelled transcript after each interview"><Toggle checked={settings.transcription} onChange={(v) => set("transcription", v)} /></SetRow>
            <SetRow title="AI-assisted evaluation" desc="Draft rubric scores for interviewer review"><Toggle checked={settings.aiEval} onChange={(v) => set("aiEval", v)} /></SetRow>
            <SetRow title="Require fullscreen for candidates"><Toggle checked={settings.requireFullscreen} onChange={(v) => set("requireFullscreen", v)} /></SetRow>
            <SetRow title="Auto-reject on HIGH risk" desc="Disabled by design — humans make every hiring decision"><Toggle checked={false} disabled onChange={() => {}} /></SetRow>
          </Card>
          <div className="col" style={{ gap: 18 }}>
            <Card title="Integrity signals" icon="shield" subtitle="Disabled families are not collected or shown in consent">
              {FAMILY_KEYS.map((k) => <SetRow key={k} title={<span className="row" style={{ gap: 8 }}><span className="fam-ic" style={{ width: 26, height: 26, background: FAMILIES[k].bg, color: FAMILIES[k].color }}><Icon name={FAMILIES[k].icon} size={13} /></span>{FAMILIES[k].label}</span>} desc={FAMILIES[k].signals.join(" · ")}><Toggle checked={settings.signals[k]} onChange={(v) => { set("signals", { ...settings.signals, [k]: v }); notify(`${FAMILIES[k].label} ${v ? "enabled" : "disabled"}`); }} /></SetRow>)}
              <SetRow title="Detection sensitivity"><div className="seg">{["Lenient", "Balanced", "Strict"].map((s) => <button key={s} className={settings.sensitivity === s ? "active" : ""} onClick={() => set("sensitivity", s)}>{s}</button>)}</div></SetRow>
            </Card>
            <Card title="Evaluation weights" icon="scale" subtitle="Must total 100%">
              {DIMS.map((d) => <div key={d.key} className="row mb-12"><span className="small bold" style={{ flex: 1 }}>{d.label}</span><input type="range" className="range" style={{ width: 140 }} min="0" max="60" step="5" value={weights[d.key]} onChange={(e) => setWeights({ ...weights, [d.key]: Number(e.target.value) })} /><Badge tone="navy" style={{ minWidth: 46, justifyContent: "center" }}>{weights[d.key]}%</Badge></div>)}
              <div className="row between"><span className="small" style={{ color: wSum === 100 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>Total: {wSum}%</span><div className="row"><Btn size="sm" variant="ghost" onClick={() => setWeights(DEFAULT_WEIGHTS)}>Defaults</Btn><Btn size="sm" disabled={wSum !== 100} onClick={() => { set("weights", weights); notify("Evaluation weights updated — scores recalculated"); }}>Apply</Btn></div></div>
            </Card>
          </div>
        </div>
      )}

      {tab === "notif" && (
        <Card title="Notification preferences" icon="bell" style={{ maxWidth: 760 }}>
          {[["email_high", "HIGH integrity risk alerts", "Email the interviewer and recruiter when an interview crosses 60"], ["live_alert", "Live in-room alerts", "Show integrity signals in the interviewer sidebar during interviews"], ["eval_ready", "Evaluation draft ready", "Notify when the AI scorecard draft is ready for review"], ["digest", "Daily hiring digest", "Summary of interviews, pending sign-offs and flags at 8:00 AM"], ["cancel", "Cancellations & reschedules", "Notify when a candidate cancels or reschedules"], ["slack", "Slack notifications", "Post alerts to #hiring-alerts"], ["sms", "SMS for urgent alerts", "Text message for HIGH risk during live interviews"]].map(([k, t, d]) => (
            <SetRow key={k} title={t} desc={d}><Toggle checked={settings.notif[k]} onChange={(v) => { set("notif", { ...settings.notif, [k]: v }); notify(`${t} ${v ? "enabled" : "disabled"}`); }} /></SetRow>
          ))}
        </Card>
      )}

      {tab === "privacy" && (
        <div className="grid g-2">
          <Card title="Data retention" icon="database">
            <Field label={`Recording retention: ${settings.retention} days`} hint="Recordings and evidence clips are auto-deleted after this period"><input type="range" className="range" min="30" max="365" step="15" value={settings.retention} onChange={(e) => set("retention", Number(e.target.value))} /></Field>
            <Field label={`Transcript retention: ${settings.transcriptRetention} days`}><input type="range" className="range" min="30" max="730" step="30" value={settings.transcriptRetention} onChange={(e) => set("transcriptRetention", Number(e.target.value))} /></Field>
            <SetRow title="Candidate consent required" desc="Candidates must accept monitoring before joining (cannot be disabled)"><Toggle checked disabled onChange={() => {}} /></SetRow>
            <SetRow title="PII masking before AI processing" desc="Names, emails and phone numbers are stripped before LLM scoring"><Toggle checked={settings.piiMasking} onChange={(v) => set("piiMasking", v)} /></SetRow>
            <SetRow title="Anonymise scorecards for panel" desc="Hide candidate name and photo from hiring panel reviewers"><Toggle checked={settings.anonymiseReports} onChange={(v) => set("anonymiseReports", v)} /></SetRow>
            <SetRow title="Data residency"><Badge tone="navy">{settings.region}</Badge></SetRow>
            <div className="row mt-12" style={{ justifyContent: "flex-end" }}><Btn icon="check" onClick={() => notify("Privacy settings saved & logged to audit trail")}>Save privacy settings</Btn></div>
          </Card>
          <div className="col" style={{ gap: 18 }}>
            <Card title="Data subject requests" icon="user" subtitle="DPDP Act / GDPR — export & delete on request">
              <div className="row wrap"><Btn variant="secondary" icon="download" onClick={() => notify("Candidate data export queued — link emailed within 24h (simulated)")}>Export candidate data</Btn><Btn variant="soft-danger" icon="trash" onClick={() => confirm({ title: "Delete candidate data?", message: "All recordings, transcripts, evidence clips and evaluations for the selected candidate will be permanently deleted. An audit record is kept.", confirmLabel: "Delete permanently", danger: true, onConfirm: () => notify("Deletion request processed (simulated)", "warn") })}>Delete candidate data</Btn></div>
              <div className="banner info mt-16"><Icon name="lock" size={18} /><div className="small">KMS encryption at rest · tenant isolation by org · least-privilege access.</div></div>
            </Card>
            <Card title="Audit log" icon="history" noBody>
              {audit.map(([who, what, when], i) => <div key={i} className="list-item" style={{ cursor: "default" }}><Avatar name={who} size={28} /><div style={{ flex: 1 }}><div className="small">{what}</div><div className="xs muted">{who} · {when}</div></div></div>)}
            </Card>
          </div>
        </div>
      )}

      <Modal open={!!invite} onClose={() => setInvite(null)} title="Invite user" footer={<><Btn variant="secondary" onClick={() => setInvite(null)}>Cancel</Btn><Btn icon="send" onClick={sendInvite}>Send invitation</Btn></>}>
        {invite && <>
          <Field label="Full name"><input className="inp" value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} /></Field>
          <Field label="Work email"><input className="inp" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder={`name@${org.domain}`} /></Field>
          <Field label="Job title"><input className="inp" value={invite.title} onChange={(e) => setInvite({ ...invite, title: e.target.value })} /></Field>
          <Field label="Role"><select className="inp" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}><option>Admin</option><option>Interviewer</option><option>Recruiter</option><option>Viewer</option></select></Field>
        </>}
      </Modal>
    </>
  );
}

/* ============================================================================
   APP SHELL
   ========================================================================== */
const NAV = [
  { group: "Workspace", items: [{ key: "dashboard", label: "Dashboard", icon: "dashboard" }, { key: "interviews", label: "Interviews", icon: "calendar" }, { key: "room", label: "Interview Room", icon: "video" }, { key: "questions", label: "Question Bank", icon: "book" }] },
  { group: "Core modules", items: [{ key: "integrity", label: "Integrity Monitoring", icon: "shield" }, { key: "evaluation", label: "AI Evaluation", icon: "sparkles" }, { key: "reports", label: "Scorecards & Reports", icon: "file" }] },
  { group: "Admin", items: [{ key: "settings", label: "Settings", icon: "settings" }] },
];
const TITLES = { dashboard: "Dashboard", interviews: "Interviews", room: "Interview Room", questions: "Question Bank", integrity: "Integrity Monitoring", evaluation: "AI Evaluation", reports: "Scorecards", settings: "Settings" };

export default function App({ initialPage = "dashboard" }) {
  const [page, setPage] = useState(initialPage);
  const [ctx, setCtx] = useState({ nav: 0 });
  const [interviews, setInterviews] = useState(SEED_INTERVIEWS);
  const [events, setEvents] = useState(SEED_EVENTS);
  const [questions, setQuestions] = useState(SEED_QUESTIONS);
  const [evals, setEvals] = useState(buildSeedEvals);
  const [users, setUsers] = useState(SEED_USERS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [globalQ, setGlobalQ] = useState("");
  const [live, setLive] = useState({ iid: "INT-1042", status: "idle", elapsed: 0, qIndex: 0, notes: {}, history: [], answers: {}, analyses: {}, mic: true, cam: true, candCam: true, consent: false, fired: [] });
  const [org, setOrg] = useState(loadOrg);
  const [now, setNow] = useState(() => new Date());

  /* clock: drives the time-of-day greeting and automatic interview status updates */
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  /* interviews as displayed everywhere: status derived from date/time + attendance */
  const ivView = useMemo(() => interviews.map((i) => { const st = deriveStatus(i, now); return st === i.status ? i : { ...i, status: st }; }), [interviews, now]);
  /* attended interviews that ended automatically get an AI evaluation draft for human review */
  useEffect(() => {
    const missing = ivView.filter((i) => i.status === "Completed" && !evals[i.id]);
    if (missing.length) setEvals((p) => { const n = { ...p }; missing.forEach((i) => { if (!n[i.id]) n[i.id] = { ...makeEval(i, autoProfile(i.id)), generatedAt: i.date }; }); return n; });
  }, [ivView]); // eslint-disable-line react-hooks/exhaustive-deps
  const saveOrg = (o) => { setOrg(o); return persistOrg(o); };

  const notify = (msg, type = "success") => { const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, msg, type }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800); };
  const confirm = (c) => setConfirmState(c);
  const go = (p, extra = {}) => { setPage(p); setCtx((c) => ({ nav: c.nav + 1, ...extra })); setSideOpen(false); setBellOpen(false); setUserOpen(false); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* noop */ } };

  /* live interview timer */
  useEffect(() => {
    if (live.status !== "running") return undefined;
    const t = setInterval(() => setLive((l) => ({ ...l, elapsed: l.elapsed + 1 })), 1000);
    return () => clearInterval(t);
  }, [live.status]);

  /* simulated integrity signal stream */
  useEffect(() => {
    if (live.status !== "running") return;
    const step = LIVE_SCRIPT.find((s) => s.at <= live.elapsed && !(live.fired || []).includes(s.at));
    if (!step) return;
    setLive((l) => ({ ...l, fired: [...(l.fired || []), step.at] }));
    if (!settings.signals[step.family]) return;
    const e = { id: "EV-L" + step.at + "-" + Math.floor(Math.random() * 100000), iid: live.iid, family: step.family, signal: step.signal, ts: fmtClock(step.at), sev: step.sev, conf: step.conf, desc: step.desc, evidence: step.evidence, status: "active", notes: [], hard: false };
    setEvents((p) => [...p, e]);
    if (settings.notif.live_alert) notify(`Integrity signal: ${step.signal} (${Math.round(step.conf * 100)}% confidence)`, step.sev >= 2 ? "warn" : "info");
  }, [live.elapsed, live.status, (live.fired || []).length]); // eslint-disable-line react-hooks/exhaustive-deps

  const startInterview = (id) => {
    const iv = interviews.find((i) => i.id === id);
    const opening = iv ? resumeQuestions(iv.candidate, iv.role)[0] : null;
    setInterviews((p) => p.map((i) => (i.id === id ? { ...i, status: "In Progress", consent: true, joinedAt: i.joinedAt || new Date().toTimeString().slice(0, 5) } : i)));
    setLive((l) => ({ ...l, iid: id, status: "running", elapsed: 0, qIndex: 0, notes: {}, history: opening ? [{ ...opening, askedAt: "00:00:00" }] : [], answers: {}, analyses: {}, fired: [] }));
    notify("Interview started · recording & integrity monitoring active");
  };
  const endInterview = (id) => {
    const iv = interviews.find((i) => i.id === id);
    const notesText = (live.history || []).map((h, i) => {
      const parts = [`Q${i + 1} [${QTYPE_META[h.type][0]}] ${h.text}`];
      if (live.answers && live.answers[h.key]) parts.push(`  Answer (transcript): ${live.answers[h.key].slice(0, 220)}${live.answers[h.key].length > 220 ? "…" : ""}`);
      if (live.notes[h.key]) parts.push(`  Notes: ${live.notes[h.key]}`);
      return parts.join("\n");
    }).join("\n");
    setInterviews((p) => p.map((i) => (i.id === id ? { ...i, status: "Completed" } : i)));
    setEvals((p) => (p[id] ? p : { ...p, [id]: { ...makeEval(iv, { dims: [4, 3, 4, 4], q: [4, 3, 4, 4, 4] }), liveNotes: notesText, generatedAt: TODAY } }));
    setLive((l) => ({ ...l, status: "ended" }));
    notify("Interview ended · AI evaluation draft generated for your review");
  };

  const openFlags = events.filter((e) => e.status === "active" && e.sev >= 2).length;
  const pendingEvals = Object.values(evals).filter((e) => !e.signedOff).length;
  const notifications = [
    ...events.filter((e) => e.status === "active" && e.sev === 3).slice(0, 3).map((e) => ({ icon: "alert", tone: "red", text: `High-severity ${e.signal.toLowerCase()} flag on ${interviews.find((i) => i.id === e.iid)?.candidate.name}`, time: e.ts, onClick: () => go("integrity", { integrityId: e.iid, eventId: e.id }) })),
    ...Object.values(evals).filter((e) => !e.signedOff).slice(0, 2).map((e) => ({ icon: "sparkles", tone: "purple", text: `AI evaluation ready for ${interviews.find((i) => i.id === e.iid)?.candidate.name} — awaiting sign-off`, time: fmtDate(e.generatedAt, { day: "numeric", month: "short" }), onClick: () => go("evaluation", { evalId: e.iid }) })),
  ];
  const nextUp = ivView.filter((i) => i.status === "Scheduled" && slotEnd(i) > now).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  if (nextUp) notifications.push({ icon: "calendar", tone: "blue", text: `Next interview: ${nextUp.candidate.name} ${nextUp.date === TODAY ? "today" : "on " + fmtDate(nextUp.date, { weekday: "short", day: "numeric", month: "short" })} at ${fmtTime(nextUp.time)}`, time: isDueNow(nextUp, now) ? "Due now" : nextUp.date === TODAY ? "Today" : "Upcoming", onClick: () => go("room", { roomId: nextUp.id }) });
  const noShowToday = ivView.filter((i) => i.status === "No Show" && i.date === TODAY);
  noShowToday.forEach((i) => notifications.push({ icon: "alert", tone: "amber", text: `${i.candidate.name} did not join the ${fmtTime(i.time)} interview — marked No Show`, time: "Today", onClick: () => go("interviews", { viewId: i.id }) }));

  const pageProps = { interviews: ivView, setInterviews, org, saveOrg, now, events, setEvents, questions, setQuestions, evals, setEvals, users, setUsers, settings, setSettings, weights: settings.weights, notify, confirm, go, ctx, live, setLive, startInterview, endInterview };
  const PAGES = { dashboard: DashboardPage, interviews: InterviewsPage, room: RoomPage, questions: QuestionBankPage, integrity: IntegrityPage, evaluation: EvaluationPage, reports: ReportsPage, settings: SettingsPage };
  const PageComp = PAGES[page] || DashboardPage;

  return (
    <div className="ch-root">
      <style>{CSS}</style>
      <div className="ch-layout">
        <div className={`side-ov ${sideOpen ? "show" : ""}`} onClick={() => setSideOpen(false)} />
        <aside className={`ch-sidebar ${sideOpen ? "open" : ""}`}>
          <div className="ch-brand"><div className="ch-logo"><Icon name="shieldCheck" size={20} stroke={2.2} /></div><div><div className="ch-brand-name">Credang AI</div><div className="ch-brand-sub">Interview Integrity & Evaluation</div></div></div>
          <nav className="ch-nav">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="ch-nav-label">{g.group}</div>
                {g.items.map((it) => (
                  <button key={it.key} className={`ch-nav-item ${page === it.key ? "active" : ""}`} onClick={() => go(it.key)}>
                    <Icon name={it.icon} size={18} />{it.label}
                    {it.key === "room" && live.status === "running" && <span className="ch-nav-badge live">LIVE</span>}
                    {it.key === "integrity" && openFlags > 0 && <span className="ch-nav-badge">{openFlags}</span>}
                    {it.key === "evaluation" && pendingEvals > 0 && <span className="ch-nav-badge" style={{ background: "rgba(139,125,250,.9)" }}>{pendingEvals}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="ch-side-foot"><div className="ch-guard"><b><Icon name="users" size={14} />Human decides</b>AI flags and drafts scores. It never auto-rejects — final hiring decisions stay with interviewers.</div></div>
        </aside>

        <main className="ch-main">
          <header className="ch-topbar">
            <button className="ch-icon-btn ch-menu-btn" onClick={() => setSideOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
            <form className="ch-search" onSubmit={(e) => { e.preventDefault(); go("interviews", { search: globalQ }); }}>
              <Icon name="search" size={16} className="ic" />
              <input value={globalQ} onChange={(e) => setGlobalQ(e.target.value)} placeholder="Search candidates, interviews, IDs… (Enter)" />
            </form>
            <div className="ch-top-right">
              {live.status === "running" && <span className="ch-live-pill" onClick={() => go("room", { roomId: live.iid })}><span className="rec-dot" />LIVE {fmtClock(live.elapsed)}</span>}
              <span className="ch-proto-pill">Prototype · simulated data</span>
              <div style={{ position: "relative" }}>
                <button className="ch-icon-btn" onClick={() => { setBellOpen(!bellOpen); setUserOpen(false); }} aria-label="Notifications"><Icon name="bell" />{notifications.length > 0 && <span className="ch-dot" />}</button>
                {bellOpen && (
                  <div className="ch-dropdown">
                    <div className="ch-dd-head">Notifications <Btn size="sm" variant="ghost" onClick={() => { setBellOpen(false); notify("All notifications marked as read"); }}>Mark all read</Btn></div>
                    {notifications.map((n, i) => <div key={i} className="ch-dd-item" onClick={n.onClick}><div className="fam-ic" style={{ width: 30, height: 30, background: `var(--${n.tone === "purple" ? "purple" : n.tone}-50)`, color: `var(--${n.tone})` }}><Icon name={n.icon} size={15} /></div><div style={{ flex: 1 }}><div>{n.text}</div><div className="xs muted">{n.time}</div></div></div>)}
                  </div>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <div className="ch-user" onClick={() => { setUserOpen(!userOpen); setBellOpen(false); }}><Avatar name={ADMIN_NAME} size={36} /><div className="ch-user-meta"><div className="ch-user-name">{ADMIN_NAME}</div><div className="ch-user-role">Admin · {org.shortName}</div></div><Icon name="chevronDown" size={15} style={{ color: "var(--faint)" }} /></div>
                {userOpen && (
                  <div className="ch-dropdown" style={{ width: 230 }}>
                    <div className="ch-dd-item" onClick={() => go("settings")}><Icon name="user" size={16} />My profile</div>
                    <div className="ch-dd-item" onClick={() => go("settings")}><Icon name="settings" size={16} />Settings</div>
                    <div className="ch-dd-item" onClick={() => { setUserOpen(false); notify("Sign-out is disabled in the prototype", "info"); }}><Icon name="logout" size={16} />Sign out</div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <div className="ch-content" key={page + ctx.nav} onClick={() => { if (bellOpen) setBellOpen(false); if (userOpen) setUserOpen(false); }}>
            <PageComp {...pageProps} />
          </div>
        </main>
      </div>

      <Modal open={!!confirmState} onClose={() => setConfirmState(null)} title={confirmState?.title} width={460}
        footer={<><Btn variant="secondary" onClick={() => setConfirmState(null)}>Go back</Btn><Btn variant={confirmState?.danger ? "danger" : "primary"} onClick={() => { confirmState.onConfirm(); setConfirmState(null); }}>{confirmState?.confirmLabel || "Confirm"}</Btn></>}>
        <div className="row" style={{ alignItems: "flex-start", gap: 14 }}><div className="fam-ic" style={{ width: 40, height: 40, background: confirmState?.danger ? "var(--red-50)" : "var(--purple-50)", color: confirmState?.danger ? "var(--red)" : "var(--purple)" }}><Icon name={confirmState?.danger ? "alert" : "info"} size={20} /></div><div style={{ color: "var(--text-2)" }}>{confirmState?.message}</div></div>
      </Modal>

      <div className="toasts">
        {toasts.map((t) => { const c = { success: ["#0F9D74", "check"], warn: ["#D98A06", "alert"], info: ["#6C5CE7", "info"] }[t.type] || ["#0F9D74", "check"]; return (
          <div key={t.id} className="toast"><div className="ti" style={{ background: c[0] }}><Icon name={c[1]} size={14} stroke={2.4} /></div><div style={{ flex: 1, paddingTop: 2 }}>{t.msg}</div><button className="icon-act" style={{ width: 22, height: 22, color: "#8E98C2" }} onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}><Icon name="x" size={13} /></button></div>
        ); })}
      </div>
    </div>
  );
}
