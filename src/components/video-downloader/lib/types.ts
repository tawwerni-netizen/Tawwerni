/** Mirrors the FastAPI schemas. Kept hand-written and small so the contract is
 *  visible in one place rather than buried in generated output. */

export type ContentType = "video" | "playlist" | "channel" | "audio" | "live";

export type JobStatus =
  | "queued"
  | "analyzing"
  | "downloading"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export interface MediaFormat {
  id: string;
  ext: string;
  resolution: string | null;
  label: string;
  width: number | null;
  height: number | null;
  fps: number | null;
  has_video: boolean;
  has_audio: boolean;
  filesize: number | null;
  filesize_approx: boolean;
  tbr: number | null;
  vcodec: string | null;
  acodec: string | null;
  abr: number | null;
  protocol: string | null;
  needs_merge: boolean;
  needs_transcode: boolean;
}

export interface QualityOption {
  id: string;
  label: string;
  height: number | null;
  kind: "video" | "audio" | "auto";
  ext: string | null;
  filesize: number | null;
  filesize_approx: boolean;
  recommended: boolean;
}

export interface SourceInfo {
  id: string | null;
  extractor: string;
  domain: string;
  site: string;
  webpage_url: string | null;
}

export interface PlaylistItem {
  index: number;
  id: string | null;
  url: string;
  title: string | null;
  thumbnail: string | null;
  duration: number | null;
  uploader: string | null;
  available: boolean;
  reason: string | null;
}

export interface PlaylistPreview {
  id: string | null;
  title: string | null;
  uploader: string | null;
  thumbnail: string | null;
  total: number;
  returned: number;
  offset: number;
  truncated: boolean;
  items: PlaylistItem[];
}

export interface AnalyzeResponse {
  type: ContentType;
  source: SourceInfo;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  uploader: string | null;
  uploader_url: string | null;
  duration: number | null;
  upload_date: string | null;
  view_count: number | null;
  is_live: boolean;
  age_limit: number;
  formats: MediaFormat[];
  video_qualities: QualityOption[];
  audio_qualities: QualityOption[];
  containers: string[];
  audio_containers: string[];
  playlist: PlaylistPreview | null;
  cached: boolean;
  analyzed_in_ms: number | null;
}

export interface DownloadOptions {
  audio_only: boolean;
  mode: "best" | "height" | "worst" | "format_id";
  height?: number | null;
  format_id?: string | null;
  container: "mp4" | "webm" | "mkv" | "mov" | "auto";
  audio_container: "mp3" | "m4a" | "wav" | "opus" | "flac";
  allow_transcode: boolean;
  embed_thumbnail: boolean;
  embed_metadata: boolean;
}

export interface JobItemResponse {
  index: number;
  title: string | null;
  thumbnail: string | null;
  duration: number | null;
  status: JobStatus;
  progress: number;
  file_name: string | null;
  file_size: number | null;
  error_code: string | null;
  download_url: string | null;
}

export interface JobResponse {
  id: string;
  kind: "single" | "batch";
  status: JobStatus;
  progress: number;
  title: string | null;
  uploader: string | null;
  thumbnail: string | null;
  duration: number | null;
  source: string;
  extractor: string;
  total_items: number;
  completed_items: number;
  failed_items: number;
  file_name: string | null;
  file_size: number | null;
  download_url: string | null;
  archive_url: string | null;
  error_code: string | null;
  error_message: string | null;
  retryable: boolean;
  options: Record<string, unknown>;
  items: JobItemResponse[];
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

export interface ProgressSnapshot {
  job_id: string;
  status: JobStatus;
  progress: number;
  stage: string | null;
  downloaded_bytes: number | null;
  total_bytes: number | null;
  speed: number | null;
  eta: number | null;
  current_index: number | null;
  total_items: number | null;
  completed_items: number | null;
  current_title: string | null;
  error_code: string | null;
  error_message: string | null;
  download_url: string | null;
  updated_at: number;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  retryable?: boolean;
  retry_after?: number;
  max_items?: number;
}
