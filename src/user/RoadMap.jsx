import React, { useEffect, useState } from "react";

function RoadmapNode({ node, level = 0 }) {
  return (
    <div style={{ marginLeft: level * 20 }}>
      <p className="font-semibold">{node.text}</p>
      {node.children?.length > 0 && (
        <div>
          {node.children.map((child, i) => (
            <RoadmapNode key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Roadmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://roadmap.sh/frontend.json")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Frontend Roadmap</h1>
      {data?.nodes.map((node, i) => (
        <RoadmapNode key={i} node={node} />
      ))}
    </div>
  );
}
