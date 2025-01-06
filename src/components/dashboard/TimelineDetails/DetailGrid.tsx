import { Monitor, User, Hash, Database, Shield, Info, Clock, Globe } from "lucide-react";

interface DetailGridProps {
  data: {
    computer_name?: string;
    user_id?: string;
    event_id?: string;
    provider_name?: string;
    ruleid?: string;
    rule_level?: string;
    task?: string;
    target_domain_name?: string;
    target_user_name?: string;
    system_time?: string;
    ip_address?: string;
    dbscan_cluster?: number;
  };
}

const DetailGrid = ({ data }: DetailGridProps) => (
  <div className="grid grid-cols-2 gap-6">
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <Monitor className="h-4 w-4" /> Computer
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.computer_name || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <User className="h-4 w-4" /> User ID
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.user_id || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <Hash className="h-4 w-4" /> Event ID
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.event_id || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <Database className="h-4 w-4" /> Provider
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.provider_name || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <Shield className="h-4 w-4" /> Rule ID
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.ruleid || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <Info className="h-4 w-4" /> Rule Level
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10 capitalize">
        {data.rule_level || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4" /> System Time
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {new Date(data.system_time || '').toLocaleString()}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400 flex items-center gap-2 mb-2">
        <Globe className="h-4 w-4" /> Target Domain
      </h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.target_domain_name || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400">Target User</h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.target_user_name || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400">IP Address</h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.ip_address || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400">DBSCAN Cluster</h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
        {data.dbscan_cluster || 'N/A'}
      </p>
    </div>
    <div>
      <h4 className="text-sm font-medium text-blue-400">Task</h4>
      <p className="text-sm text-blue-100 font-mono bg-blue-400/5 p-2 rounded-md border border-blue-400/10 capitalize">
        {data.task || 'N/A'}
      </p>
    </div>
  </div>
);

export default DetailGrid;