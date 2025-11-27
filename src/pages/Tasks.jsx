import React, { useState } from 'react';
import { ListTodo, Plus, CheckCircle2, Circle, Clock, AlertCircle, Trash2, Edit2, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DEPARTMENTS = ['All', 'Engineering', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Product'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['todo', 'in_progress', 'review', 'done'];

const STATUS_CONFIG = {
    todo: { label: 'To Do', icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100' },
    in_progress: { label: 'In Progress', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100' },
    review: { label: 'Review', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100' },
    done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
};

const PRIORITY_CONFIG = {
    low: { label: 'Low', color: 'bg-gray-100 text-gray-600' },
    medium: { label: 'Medium', color: 'bg-blue-100 text-blue-600' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-600' },
    urgent: { label: 'Urgent', color: 'bg-red-100 text-red-600' },
};

export default function Tasks() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Launch new marketing campaign', description: 'Q1 product launch campaign', department: 'Marketing', priority: 'high', status: 'in_progress', due_date: '2025-01-15' },
        { id: 2, title: 'Update API documentation', description: 'Document new endpoints', department: 'Engineering', priority: 'medium', status: 'todo', due_date: '2025-01-20' },
        { id: 3, title: 'Quarterly sales review', description: 'Prepare Q4 sales report', department: 'Sales', priority: 'urgent', status: 'review', due_date: '2025-01-10' },
        { id: 4, title: 'Hire 2 new developers', description: 'Backend engineers for scaling', department: 'HR', priority: 'high', status: 'in_progress', due_date: '2025-02-01' },
        { id: 5, title: 'Budget planning 2025', description: 'Annual budget allocation', department: 'Finance', priority: 'urgent', status: 'done', due_date: '2025-01-05' },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [filterStatus, setFilterStatus] = useState('all');
    const [newTask, setNewTask] = useState({ title: '', description: '', department: 'Engineering', priority: 'medium', status: 'todo', due_date: '' });

    const handleAddTask = () => {
        if (!newTask.title.trim()) return;
        const task = { ...newTask, id: Date.now() };
        setTasks([task, ...tasks]);
        setNewTask({ title: '', description: '', department: 'Engineering', priority: 'medium', status: 'todo', due_date: '' });
        setShowForm(false);
    };

    const handleUpdateTask = () => {
        if (!editingTask.title.trim()) return;
        setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
        setEditingTask(null);
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleStatusChange = (taskId, newStatus) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const filteredTasks = tasks.filter(task => {
        const deptMatch = filterDepartment === 'All' || task.department === filterDepartment;
        const statusMatch = filterStatus === 'all' || task.status === filterStatus;
        return deptMatch && statusMatch;
    });

    const tasksByStatus = STATUSES.reduce((acc, status) => {
        acc[status] = filteredTasks.filter(t => t.status === status);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <ListTodo className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Task Management</h1>
                                <p className="text-white/80">Track initiatives across all departments</p>
                            </div>
                        </div>
                        <Button onClick={() => setShowForm(true)} className="bg-white text-purple-600 hover:bg-white/90 gap-2">
                            <Plus className="w-4 h-4" /> New Task
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                        <SelectTrigger className="w-40 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500 self-center ml-auto">{filteredTasks.length} tasks</span>
                </div>

                {/* Task Form Modal */}
                {(showForm || editingTask) && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold">{editingTask ? 'Edit Task' : 'New Task'}</h2>
                                <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingTask(null); }}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Task title"
                                    value={editingTask ? editingTask.title : newTask.title}
                                    onChange={(e) => editingTask ? setEditingTask({ ...editingTask, title: e.target.value }) : setNewTask({ ...newTask, title: e.target.value })}
                                />
                                <Textarea
                                    placeholder="Description"
                                    value={editingTask ? editingTask.description : newTask.description}
                                    onChange={(e) => editingTask ? setEditingTask({ ...editingTask, description: e.target.value }) : setNewTask({ ...newTask, description: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Select value={editingTask ? editingTask.department : newTask.department} onValueChange={(v) => editingTask ? setEditingTask({ ...editingTask, department: v }) : setNewTask({ ...newTask, department: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DEPARTMENTS.filter(d => d !== 'All').map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={editingTask ? editingTask.priority : newTask.priority} onValueChange={(v) => editingTask ? setEditingTask({ ...editingTask, priority: v }) : setNewTask({ ...newTask, priority: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{PRIORITY_CONFIG[p].label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Input
                                    type="date"
                                    value={editingTask ? editingTask.due_date : newTask.due_date}
                                    onChange={(e) => editingTask ? setEditingTask({ ...editingTask, due_date: e.target.value }) : setNewTask({ ...newTask, due_date: e.target.value })}
                                />
                                <Button onClick={editingTask ? handleUpdateTask : handleAddTask} className="w-full bg-purple-600 hover:bg-purple-700">
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATUSES.map(status => {
                        const config = STATUS_CONFIG[status];
                        const StatusIcon = config.icon;
                        return (
                            <div key={status} className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <StatusIcon className={`w-5 h-5 ${config.color}`} />
                                    <h3 className="font-semibold text-gray-900">{config.label}</h3>
                                    <span className="ml-auto text-sm text-gray-400">{tasksByStatus[status].length}</span>
                                </div>
                                <div className="space-y-3">
                                    {tasksByStatus[status].map(task => (
                                        <div key={task.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-purple-200 transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                                <div className="flex gap-1">
                                                    <button onClick={() => setEditingTask(task)} className="p-1 hover:bg-gray-200 rounded">
                                                        <Edit2 className="w-3 h-3 text-gray-400" />
                                                    </button>
                                                    <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-red-100 rounded">
                                                        <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            {task.description && <p className="text-xs text-gray-500 mb-2">{task.description}</p>}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">{task.department}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[task.priority].color}`}>
                                                    {PRIORITY_CONFIG[task.priority].label}
                                                </span>
                                            </div>
                                            {task.due_date && (
                                                <p className="text-xs text-gray-400 mt-2">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                                            )}
                                            {status !== 'done' && (
                                                <Select value={task.status} onValueChange={(v) => handleStatusChange(task.id, v)}>
                                                    <SelectTrigger className="mt-2 h-7 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    ))}
                                    {tasksByStatus[status].length === 0 && (
                                        <p className="text-center text-gray-400 text-sm py-8">No tasks</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}