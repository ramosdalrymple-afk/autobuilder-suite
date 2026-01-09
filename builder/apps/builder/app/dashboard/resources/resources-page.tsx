import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  theme,
  Button,
  InputField,
  Label,
  css,
} from "@webstudio-is/design-system";
// Using safe icons only
import { PluginIcon, TrashIcon, CheckMarkIcon, AlertIcon } from "@webstudio-is/icons";
import { useFetcher } from "@remix-run/react";
import { json, type ActionFunction } from "@remix-run/node";

// --- STYLES ---

const containerStyle = css({
  padding: theme.spacing[8],
  maxWidth: "1000px",
  margin: "0 auto",
  width: "100%",
});

const headerStyle = css({
  marginBottom: theme.spacing[8],
  borderBottom: `1px solid ${theme.colors.borderMain}`,
  paddingBottom: theme.spacing[6],
});

const formCardStyle = css({
  padding: theme.spacing[6],
  backgroundColor: theme.colors.surfaceNeutralSubtle,
  borderRadius: theme.borderRadius[2],
  border: `1px solid ${theme.colors.borderMain}`,
});

// Cleaner, flatter card style
const resourceCardStyle = css({
  backgroundColor: theme.colors.surfaceNeutral,
  borderBottom: `1px solid ${theme.colors.borderMain}`,
  transition: "background-color 0.2s ease",
  "&:first-child": {
     borderTop: `1px solid ${theme.colors.borderMain}`,
  },
  "&:hover": {
    backgroundColor: theme.colors.surfaceNeutralSubtle,
  },
});

const statusBadgeSuccess = css({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing[1],
  padding: `2px 6px`, // Smaller, pill-like
  backgroundColor: "rgba(34, 197, 94, 0.1)", // Subtle green bg
  color: "#15803d", // Darker green text
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "600",
  border: "1px solid rgba(34, 197, 94, 0.2)"
});

const statusBadgeError = css({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing[1],
  padding: `2px 6px`,
  backgroundColor: "rgba(239, 68, 68, 0.1)",
  color: "#b91c1c",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: "600",
  border: "1px solid rgba(239, 68, 68, 0.2)"
});

// --- HELPER: Resolve Absolute URL for Images ---
const resolveImageUrl = (path: string, apiUrl: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    try {
        const urlObj = new URL(apiUrl);
        return `${urlObj.origin}${path}`;
    } catch (e) {
        return path;
    }
};

// --- COMPONENT: MEDIA GRID RENDERER ---
const MediaGrid = ({ items, apiUrl }: { items: any[], apiUrl: string }) => {
    return (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", 
            gap: theme.spacing[3],
            width: "100%",
            padding: theme.spacing[4],
            backgroundColor: theme.colors.surfaceNeutralSubtle // Distinct background for the data area
        }}>
            {items.map((item: any) => {
                 const attrs = item.attributes || item;
                 const thumbUrl = attrs.formats?.thumbnail?.url || attrs.url;
                 const fullUrl = resolveImageUrl(thumbUrl, apiUrl);
                 
                 return (
                    <div key={item.id} style={{
                        border: `1px solid ${theme.colors.borderMain}`,
                        borderRadius: theme.borderRadius[2],
                        overflow: "hidden",
                        backgroundColor: theme.colors.surfaceNeutral,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                        {/* Image Preview */}
                        <div style={{ 
                            height: "120px", 
                            backgroundColor: "#f5f5f5",
                            backgroundImage: `url(${fullUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderBottom: `1px solid ${theme.colors.borderMain}`,
                            position: "relative"
                        }}>
                             {!fullUrl && (
                                <Flex css={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", color: theme.colors.foregroundSubtle }}>
                                    <PluginIcon size={24} />
                                </Flex>
                            )}
                            <div style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "white", fontSize: "9px", padding: "1px 3px", borderRadius: "2px" }}>
                                {attrs.ext?.replace('.', '').toUpperCase()}
                            </div>
                        </div>

                        {/* Metadata Footer */}
                        <Flex direction="column" gap="1" css={{ padding: theme.spacing[2] }}>
                            <Text css={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={attrs.name}>
                                {attrs.name}
                            </Text>
                            <Flex css={{ justifyContent: "space-between" }}>
                                <Text color="subtle" css={{ fontSize: "10px" }}>{attrs.width}x{attrs.height}</Text>
                                <Text color="subtle" css={{ fontSize: "10px" }}>{(attrs.size || 0).toFixed(0)}KB</Text>
                            </Flex>
                        </Flex>
                    </div>
                 )
            })}
        </div>
    )
}

// --- COMPONENT: DATA TABLE RENDERER ---
const DataTable = ({ items, columns }: { items: any[], columns: string[] }) => {
    
    const renderCellValue = (key: string, value: any) => {
        if ((key.includes('At') || key.includes('_at')) && typeof value === 'string') {
             const date = new Date(value);
             return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
        }
        if (typeof value === 'boolean') {
            return (
                <span style={{
                    color: value ? "#15803d" : "#b91c1c",
                    fontWeight: "600",
                    fontSize: "11px"
                }}>
                    {value ? "TRUE" : "FALSE"}
                </span>
            );
        }
        if (typeof value === 'object' && value !== null) return "[Object]"; 
        return String(value);
    };

    return (
        <Flex direction="column" css={{ width: "100%", overflowX: "auto", borderTop: `1px solid ${theme.colors.borderMain}` }}>
            {/* Table Header - Strapi Style (Subtle) */}
            <Flex css={{ padding: `${theme.spacing[2]} ${theme.spacing[4]}`, backgroundColor: "#f9fafb", minWidth: "100%", borderBottom: `1px solid ${theme.colors.borderMain}` }}>
              {columns.map((col) => (
                <Text key={col} css={{ flex: col === 'id' ? '0 0 50px' : 1, minWidth: col === 'id' ? '50px' : '150px', color: theme.colors.foregroundSubtle, fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {col.replace('At', '')}
                </Text>
              ))}
              <Text css={{ flex: 0.8, minWidth: "100px", color: theme.colors.foregroundSubtle, fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>STATUS</Text>
            </Flex>
            
            {/* Table Rows */}
            {items.slice(0, 10).map((item: any) => {
               const attrs = item.attributes || item;
               return (
                <Flex key={item.id || Math.random()} css={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}`, borderBottom: `1px solid ${theme.colors.borderMain}`, alignItems: "center", backgroundColor: "white", transition: "background-color 0.1s", "&:hover": { backgroundColor: "#f9fafb" } }}>
                  {columns.map((col) => {
                    const value = col === 'id' ? item.id : (attrs[col] || attrs[col.replace('At', '_at')]);
                    return (
                      <Text key={col} css={{ flex: col === 'id' ? '0 0 50px' : 1, minWidth: col === 'id' ? '50px' : '150px', color: (col === 'id' || col.includes('At')) ? theme.colors.foregroundSubtle : theme.colors.foregroundMain, fontSize: "13px", fontWeight: (col === 'id') ? "400" : "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "16px" }}>
                        {renderCellValue(col, value)}
                      </Text>
                    );
                  })}
                  <div style={{ flex: 0.8, minWidth: "100px" }}>
                    {(attrs.publishedAt || attrs.published_at) !== undefined && (
                      <span style={{ backgroundColor: (attrs.publishedAt || attrs.published_at) ? "rgba(34, 197, 94, 0.1)" : "rgba(107, 114, 128, 0.1)", color: (attrs.publishedAt || attrs.published_at) ? "#15803d" : "#374151", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>
                        {(attrs.publishedAt || attrs.published_at) ? "Published" : "Draft"}
                      </span>
                    )}
                  </div>
                </Flex>
               );
            })}
        </Flex>
    );
}

// --- COMPONENT: RESOURCE CARD (ACCORDION STYLE) ---
interface ResourceCardProps {
  id: string;
  name: string;
  url: string;
  onDelete: (id: string) => void;
}

const ResourceCard = ({ id, name, url, onDelete }: ResourceCardProps) => {
  const fetcher = useFetcher();
  const [isExpanded, setIsExpanded] = useState(false); // DEFAULT COLLAPSED
  
  // 1. Fetch on mount & Poll every 10 seconds
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.submit({ url }, { method: "post", action: "/api/test-resource" });
    }
    const interval = setInterval(() => {
      if (fetcher.state === "idle") {
        fetcher.submit({ url }, { method: "post", action: "/api/test-resource" });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [url]); 

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion
    fetcher.submit({ url }, { method: "post", action: "/api/test-resource" });
  };

  const isLoading = fetcher.state !== "idle";
  const responseData = fetcher.data?.success ? fetcher.data.data : undefined;
  const error = fetcher.data?.error;

  // Normalization & Detection
  let items: any[] = [];
  let isMediaData = false;
  if (responseData) {
      const rawData = responseData.data || responseData;
      if (Array.isArray(rawData)) items = rawData;
      else if (typeof rawData === 'object') items = [rawData];
      
      if (items.length > 0) {
          const firstAttrs = items[0].attributes || items[0];
          if (firstAttrs.mime && firstAttrs.url) isMediaData = true;
      }
  }
  const hasData = items.length > 0;

  // Columns
  let columns: string[] = [];
  if (hasData && !isMediaData) {
    const firstItem = items[0];
    const attrs = firstItem.attributes || firstItem;
    const ignoredKeys = ['id', 'documentId', 'password', 'resetPasswordToken', 'confirmationToken', 'createdAt', 'updatedAt', 'publishedAt', 'created_at', 'updated_at', 'published_at', 'localizations', 'locale', 'provider', 'blocked', 'formats'];
    columns = ['id', ...Object.keys(attrs).filter(k => !ignoredKeys.includes(k)), 'createdAt', 'publishedAt'];
  }

  return (
    <div className={resourceCardStyle()}>
      <Flex direction="column">
        {/* --- HEADER ROW (ALWAYS VISIBLE) --- */}
        <Flex 
            css={{ 
                padding: theme.spacing[4], 
                alignItems: "center", 
                justifyContent: "space-between", 
                cursor: "pointer",
                "&:hover": { backgroundColor: "#fafafa" } // Subtle hover effect
            }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Left: Info */}
            <Flex gap="3" css={{ alignItems: "center", flex: 1, overflow: "hidden" }}>
                {/* Icon based on Type */}
                <div style={{ color: theme.colors.foregroundSubtle }}>
                    {isMediaData ? <PluginIcon size={16} /> : <PluginIcon size={16} />} 
                </div>

                <Flex direction="column" gap="1" css={{ minWidth: 0 }}>
                    <Flex gap="2" css={{ alignItems: "center" }}>
                        <Text variant="labelsSemibold" css={{ fontSize: "14px" }}>{name}</Text>
                        {/* Status Badge */}
                        {error ? (
                            <div className={statusBadgeError()}>Failed</div>
                        ) : (
                            <div className={statusBadgeSuccess()}>
                                {isLoading ? "Syncing..." : "Live"}
                            </div>
                        )}
                    </Flex>
                    <Text color="subtle" css={{ fontSize: "11px", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {url}
                    </Text>
                </Flex>
            </Flex>

            {/* Right: Actions */}
            <Flex gap="2" css={{ alignItems: "center" }}>
                <Button color="neutral" onClick={handleRefresh} title="Refresh Data" css={{ height: "28px", padding: "0 8px" }}>
                    ↻
                </Button>
                <Button color="neutral" onClick={(e) => { e.stopPropagation(); onDelete(id); }} title="Delete" css={{ height: "28px", padding: "0 8px" }}>
                    <TrashIcon size={14} />
                </Button>
                {/* Expand/Collapse Indicator */}
                 <Button color="neutral" css={{ height: "28px", padding: "0 8px", minWidth: "80px", fontSize: "11px" }}>
                    {isExpanded ? "Hide Data" : "Show Data"}
                </Button>
            </Flex>
        </Flex>

        {/* --- EXPANDABLE CONTENT AREA --- */}
        {isExpanded && (
            <div style={{ borderTop: `1px solid ${theme.colors.borderMain}`, backgroundColor: "#fff" }}>
                {error ? (
                    <Text color="destructive" css={{ fontSize: "12px", padding: theme.spacing[4] }}>{error}</Text>
                ) : (
                    hasData ? (
                        isMediaData ? (
                            <MediaGrid items={items} apiUrl={url} />
                        ) : (
                            <DataTable items={items} columns={columns} />
                        )
                    ) : (
                        <Text color="subtle" css={{ padding: theme.spacing[4], fontSize: "12px", fontStyle: "italic" }}>
                            No data found or empty response.
                        </Text>
                    )
                )}
            </div>
        )}
      </Flex>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export const ResourcesPage = () => {
  const [resources, setResources] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", url: "" });

  useEffect(() => {
    const saved = localStorage.getItem("autobuilder_resources");
    if (saved) setResources(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("autobuilder_resources", JSON.stringify(resources));
  }, [resources, isLoaded]);

  const handleAddResource = () => {
    if (!formData.name || !formData.url) return;
    setResources([...resources, { id: Date.now().toString(), name: formData.name, url: formData.url }]);
    setFormData({ name: "", url: "" });
    setShowForm(false);
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  return (
    <Flex direction="column" css={{ height: "100%", width: "100%", backgroundColor: theme.colors.surfaceNeutral, overflowY: "auto" }}>
      <div className={containerStyle()}>
        {/* Header */}
        <div className={headerStyle()}>
          <Flex css={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <Flex direction="column" gap="2">
                <Flex gap="2" css={{ alignItems: "center" }}>
                <PluginIcon size={24} />
                <Text as="h1" variant="titles">Resources</Text>
                </Flex>
                <Text color="subtle">Manage your external data connections</Text>
            </Flex>
            {!showForm && <Button onClick={() => setShowForm(true)}>+ New Resource</Button>}
          </Flex>
        </div>

        {/* Add Resource Form (Collapsed by default logic handled by showForm) */}
        {showForm && (
          <div className={formCardStyle()} style={{ marginBottom: theme.spacing[6] }}>
            <Flex direction="column" gap="4">
              <Text variant="labelsSemibold">Connect New API</Text>
              <Flex gap="4">
                  <Flex direction="column" gap="1" css={{ flex: 1 }}>
                    <Label htmlFor="r-name">Name</Label>
                    <InputField id="r-name" placeholder="e.g. Products" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </Flex>
                  <Flex direction="column" gap="1" css={{ flex: 2 }}>
                    <Label htmlFor="r-url">URL</Label>
                    <InputField id="r-url" placeholder="http://..." value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
                  </Flex>
              </Flex>
              <Flex gap="3" css={{ justifyContent: "flex-end", marginTop: theme.spacing[2] }}>
                <Button color="neutral" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={handleAddResource}>Save Connection</Button>
              </Flex>
            </Flex>
          </div>
        )}

        {/* Resource List (Flat) */}
        <Flex direction="column">
            {resources.length === 0 && !showForm ? (
                <Text color="subtle" css={{ textAlign: "center", padding: theme.spacing[8] }}>No resources yet.</Text>
            ) : (
                <div style={{ border: `1px solid ${theme.colors.borderMain}`, borderRadius: theme.borderRadius[2], overflow: "hidden" }}>
                    {resources.map((resource) => (
                        <ResourceCard 
                        key={resource.id} 
                        id={resource.id}
                        name={resource.name}
                        url={resource.url}
                        onDelete={handleDeleteResource}
                        />
                    ))}
                </div>
            )}
        </Flex>
      </div>
    </Flex>
  );
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
  try {
    const formData = await request.formData();
    const url = formData.get("url") as string;
    if (!url) return json({ error: "URL is required" }, { status: 400 });
    const response = await fetch(url, { timeout: 10000 });
    if (!response.ok) return json({ error: `HTTP ${response.status}` }, { status: response.status });
    const data = await response.json();
    return json({ success: true, data: data });
  } catch (error) {
    return json({ error: String(error) }, { status: 500 });
  }
};