'use client';

import { useState, useRef } from 'react';

import { Upload, CheckCircle, Spinner } from '@phosphor-icons/react';
import { useUpload } from '@/hooks/useUpload';
import { useAuth } from '@/hooks/useAuth';
import { criarMemoria } from '@/lib/firebase/memorias';

const TIPO_OPTIONS = [
  { value: 'foto',       label: 'Foto' },
  { value: 'video',      label: 'Vídeo curto' },
  { value: 'historia',   label: 'História escrita' },
  { value: 'depoimento', label: 'Depoimento em áudio' },
];

const CATEGORIA_OPTIONS = [
  { value: '',          label: 'Selecione uma categoria' },
  { value: 'quadrilha', label: 'Quadrilhas Juninas' },
  { value: 'shows',     label: 'Shows e Palcos' },
  { value: 'vila',      label: 'Vila Junina' },
  { value: 'comida',    label: 'Comidas Típicas' },
  { value: 'familia',   label: 'Família e Retratos' },
  { value: 'forro',     label: 'Forró e Música' },
];

const ANOS = Array.from({ length: 67 }, (_, i) => 2026 - i);

/* ============================================================
   CONFETTI
   ============================================================ */
function Confetti() {
  const colors = ['#C0392B', '#E8A020', '#2D7A3A', '#1A6B8A', '#FFF8EC'];
  const pieces = Array.from({ length: 40 });

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10000 }}>
      {pieces.map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20 + 10}px`,
            background: colors[i % colors.length],
            borderRadius: i % 3 === 0 ? '50%' : '2px',
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   SUCCESS STATE
   ============================================================ */
function SuccessState({ onNew }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem',
        textAlign: 'center',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--color-verde-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckCircle size={44} weight="fill" style={{ color: 'var(--color-verde)' }} aria-hidden="true" />
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          maxWidth: '24ch',
        }}
      >
        Sua memória foi enviada com sucesso!
      </h2>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          maxWidth: '44ch',
          lineHeight: 1.7,
          fontSize: '1rem',
        }}
      >
        Ela aparecerá no acervo após revisão da nossa equipe.
        Obrigado por ajudar a preservar a história do São João de Amargosa.
      </p>
      <button
        id="enviar-nova-memoria"
        onClick={onNew}
        className="btn-secondary"
        style={{ marginTop: '0.5rem' }}
      >
        Enviar outra memória
      </button>
    </div>
  );
}

/* ============================================================
   UPLOAD FORM
   ============================================================ */
const INITIAL = {
  tipo: 'foto',
  titulo: '',
  ano: '2024',
  categoria: '',
  descricao: '',
  arquivo: null,
  previewUrl: null,
  nome: '',
  cidade: '',
};

export default function EnviarPage() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const { upload, progresso, uploading, erro: uploadError } = useUpload();
  const { user } = useAuth();

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  }

  function handleFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, arquivo: file, previewUrl: url }));
    if (errors.arquivo) setErrors(e => ({ ...e, arquivo: undefined }));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function validate() {
    const errs = {};
    if (!form.titulo.trim())    errs.titulo    = 'O título é obrigatório.';
    if (!form.categoria)        errs.categoria = 'Selecione uma categoria.';
    if (!form.descricao.trim()) errs.descricao = 'Conte a história ou descrição.';
    if (!form.nome.trim())      errs.nome      = 'Informe seu nome.';
    if (!form.cidade.trim())    errs.cidade    = 'Informe sua cidade.';
    if (!form.arquivo && form.tipo !== 'historia') errs.arquivo = 'Anexe um arquivo.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstErrKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    
    try {
      let mediaUrl = null;
      const autorId = user?.uid || 'anonimo';
      
      if (form.arquivo) {
        mediaUrl = await upload(form.arquivo);
      }

      await criarMemoria({
        titulo: form.titulo,
        descricao: form.descricao,
        categoria: form.categoria,
        anoDoSaoJoao: Number(form.ano),
        tipo: form.tipo,
        mediaUrl: mediaUrl || '',
        autorId: autorId,
        autorNome: form.nome,
        autorCidade: form.cidade,
        status: 'pendente',
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  function handleNew() {
    setForm(INITIAL);
    setErrors({});
    setSuccess(false);
  }

  return (
    <>
      {success && <Confetti />}

      {/* Header */}
      <div
        style={{
          background: 'var(--color-surface-warm)',
          paddingTop: 'clamp(6rem, 12vw, 9rem)',
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container-main">
          <span className="eyebrow">Contribua com o arquivo</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-hero)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}
          >
            Enviar uma Memória
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.0625rem',
              maxWidth: '52ch',
              lineHeight: 1.7,
            }}
          >
            Sua foto guardada, sua história que só você conhece — ela pertence a este arquivo.
            Preencha abaixo e contribua com a memória viva do São João de Amargosa.
          </p>
        </div>
      </div>

      {/* Form / Success */}
      <div
        className="container-main"
        style={{
          paddingBlock: 'clamp(3rem, 6vw, 5rem)',
          maxWidth: '52rem',
        }}
      >
        {success ? (
          <SuccessState onNew={handleNew} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* === TIPO === */}
            <fieldset
              style={{
                border: 'none',
                marginBottom: '2.5rem',
                padding: 0,
              }}
            >
              <legend
                className="form-label"
                style={{ marginBottom: '0.875rem', fontSize: '0.9375rem', fontWeight: 600 }}
              >
                Tipo de memória
              </legend>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {TIPO_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    htmlFor={`tipo-${opt.value}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1rem',
                      borderRadius: '8px',
                      border: `1px solid ${form.tipo === opt.value ? 'var(--color-fire)' : 'var(--color-border)'}`,
                      background: form.tipo === opt.value ? 'var(--color-fire-light)' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all 200ms',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: form.tipo === opt.value ? 500 : 400,
                      color: form.tipo === opt.value ? 'var(--color-fire-dark)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <input
                      type="radio"
                      id={`tipo-${opt.value}`}
                      name="tipo"
                      value={opt.value}
                      checked={form.tipo === opt.value}
                      onChange={() => setField('tipo', opt.value)}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Divider */}
            <div className="section-divider" style={{ marginBottom: '2.5rem' }} />

            {/* === TÍTULO === */}
            <div id="field-titulo" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="input-titulo">
                Título da memória <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <input
                id="input-titulo"
                type="text"
                className="form-input"
                placeholder="Ex: Quadrilha do Colégio Estadual, 1997"
                value={form.titulo}
                onChange={e => setField('titulo', e.target.value)}
                aria-required="true"
                aria-describedby={errors.titulo ? 'err-titulo' : undefined}
              />
              {errors.titulo && <p id="err-titulo" className="form-error">{errors.titulo}</p>}
            </div>

            {/* === ANO + CATEGORIA === */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
                marginBottom: '1.5rem',
              }}
              className="two-col-form"
            >
              <div id="field-ano">
                <label className="form-label" htmlFor="input-ano">
                  Ano do São João <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <select
                  id="input-ano"
                  className="form-input"
                  value={form.ano}
                  onChange={e => setField('ano', e.target.value)}
                  aria-required="true"
                >
                  {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div id="field-categoria">
                <label className="form-label" htmlFor="input-categoria">
                  Categoria <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <select
                  id="input-categoria"
                  className="form-input"
                  value={form.categoria}
                  onChange={e => setField('categoria', e.target.value)}
                  aria-required="true"
                  aria-describedby={errors.categoria ? 'err-categoria' : undefined}
                >
                  {CATEGORIA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {errors.categoria && <p id="err-categoria" className="form-error">{errors.categoria}</p>}
              </div>
            </div>

            {/* === DESCRIÇÃO === */}
            <div id="field-descricao" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" htmlFor="input-descricao">
                História ou descrição <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <textarea
                id="input-descricao"
                className="form-input"
                placeholder="Conte os detalhes dessa memória — quem estava lá, o que aconteceu, o que sentiu..."
                rows={5}
                value={form.descricao}
                onChange={e => setField('descricao', e.target.value)}
                style={{ resize: 'vertical', minHeight: '120px' }}
                aria-required="true"
                aria-describedby={errors.descricao ? 'err-descricao' : undefined}
              />
              {errors.descricao && <p id="err-descricao" className="form-error">{errors.descricao}</p>}
            </div>

            {/* === ARQUIVO (drag-and-drop) === */}
            {form.tipo !== 'historia' && (
              <div id="field-arquivo" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">
                  Arquivo {form.tipo === 'foto' ? '(foto)' : form.tipo === 'video' ? '(vídeo curto)' : '(áudio)'}
                  {form.tipo !== 'historia' && <span style={{ color: 'var(--color-accent)' }}> *</span>}
                </label>

                {form.previewUrl ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.previewUrl}
                      alt="Prévia do arquivo selecionado"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, arquivo: null, previewUrl: null }))}
                      aria-label="Remover arquivo"
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                        color: '#FDFAF4',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div
                    className={`drop-zone ${dragging ? 'dragging' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    aria-label="Área de upload — clique ou arraste o arquivo"
                    onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                  >
                    <Upload
                      size={32}
                      style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}
                      aria-hidden="true"
                    />
                    <p
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Arraste sua foto ou clique para selecionar
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', fontFamily: 'var(--font-body)' }}>
                      JPG, PNG, MP4 ou MP3 — até 50MB
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      id="input-arquivo"
                      accept="image/*,video/*,audio/*"
                      style={{ display: 'none' }}
                      onChange={e => handleFile(e.target.files?.[0])}
                      aria-label="Selecionar arquivo"
                    />
                  </div>
                )}
                {errors.arquivo && <p id="err-arquivo" className="form-error">{errors.arquivo}</p>}
              </div>
            )}

            {/* Divider */}
            <div className="section-divider" style={{ marginBottom: '2rem' }} />

            {/* === NOME + CIDADE === */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
                marginBottom: '2.5rem',
              }}
              className="two-col-form"
            >
              <div id="field-nome">
                <label className="form-label" htmlFor="input-nome">
                  Seu nome <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <input
                  id="input-nome"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Marlene Souza"
                  value={form.nome}
                  onChange={e => setField('nome', e.target.value)}
                  aria-required="true"
                  aria-describedby={errors.nome ? 'err-nome' : undefined}
                />
                {errors.nome && <p id="err-nome" className="form-error">{errors.nome}</p>}
              </div>
              <div id="field-cidade">
                <label className="form-label" htmlFor="input-cidade">
                  Cidade de origem <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <input
                  id="input-cidade"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Amargosa, Mutuípe..."
                  value={form.cidade}
                  onChange={e => setField('cidade', e.target.value)}
                  aria-required="true"
                  aria-describedby={errors.cidade ? 'err-cidade' : undefined}
                />
                {errors.cidade && <p id="err-cidade" className="form-error">{errors.cidade}</p>}
              </div>
            </div>

            {/* === SUBMIT === */}
            <button
              id="submit-memoria"
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '1rem',
                fontSize: '1rem',
                opacity: submitting ? 0.8 : 1,
                gap: '0.75rem',
              }}
            >
              {submitting ? (
                <>
                  <Spinner
                    size={20}
                    aria-hidden="true"
                    style={{
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  {uploading ? `Enviando... ${Math.round(progresso)}%` : 'Salvando...'}
                </>
              ) : (
                <>
                  <Upload size={18} weight="bold" aria-hidden="true" />
                  Enviar memória
                </>
              )}
            </button>

            <p
              style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Sua memória passará por revisão antes de aparecer no acervo público.
            </p>
            {errors.form && (
              <p className="form-error" style={{ textAlign: 'center', marginTop: '1rem' }}>
                {errors.form}
              </p>
            )}
            {uploadError && (
              <p className="form-error" style={{ textAlign: 'center', marginTop: '1rem' }}>
                Erro no upload: {uploadError}
              </p>
            )}
          </form>
        )}
      </div>


    </>
  );
}
