#!/usr/bin/env python3
"""
JSON Model Visualizer - 专门用于可视化AI模型列表的命令行工具
用法: python json_visualizer.py [文件路径] [选项]
"""

import json
import sys
import argparse
from typing import Dict, List, Any
from collections import defaultdict

class Colors:
    """ANSI颜色代码"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class ModelVisualizer:
    def __init__(self, data: List[Dict]):
        self.data = data
        
    def print_summary(self):
        """打印总览信息"""
        print(f"\n{Colors.BOLD}{Colors.HEADER}📊 模型总览{Colors.ENDC}")
        print(f"{'='*60}")
        print(f"总模型数: {Colors.OKGREEN}{len(self.data)}{Colors.ENDC}")
        
        # 按发布商分组统计
        publishers = defaultdict(int)
        for model in self.data:
            publishers[model.get('publisher', 'Unknown')] += 1
            
        print(f"\n{Colors.BOLD}📈 发布商分布:{Colors.ENDC}")
        for publisher, count in sorted(publishers.items(), key=lambda x: x[1], reverse=True):
            print(f"  {Colors.OKCYAN}{publisher:<15}{Colors.ENDC}: {Colors.OKGREEN}{count}{Colors.ENDC}")
    
    def print_detailed_list(self, limit: int = None):
        """打印详细模型列表"""
        print(f"\n{Colors.BOLD}{Colors.HEADER}🤖 详细模型列表{Colors.ENDC}")
        print(f"{'='*80}")
        
        models_to_show = self.data[:limit] if limit else self.data
        
        for i, model in enumerate(models_to_show, 1):
            print(f"\n{Colors.BOLD}{i}. {Colors.OKBLUE}{model.get('name', 'Unknown')}{Colors.ENDC}")
            print(f"   🏢 发布商: {Colors.OKCYAN}{model.get('publisher', 'Unknown')}{Colors.ENDC}")
            print(f"   🆔 ID: {Colors.WARNING}{model.get('id', 'Unknown')}{Colors.ENDC}")
            
            # 输入/输出模态
            input_modes = ', '.join(model.get('supported_input_modalities', []))
            output_modes = ', '.join(model.get('supported_output_modalities', []))
            print(f"   📥 输入: {Colors.OKGREEN}{input_modes}{Colors.ENDC}")
            print(f"   📤 输出: {Colors.OKGREEN}{output_modes}{Colors.ENDC}")
            
            # 限制信息
            limits = model.get('limits', {})
            max_input = limits.get('max_input_tokens')
            max_output = limits.get('max_output_tokens')
            
            # 格式化输入限制
            if max_input is not None:
                input_str = f"{max_input:,}"
            else:
                input_str = "N/A"
            
            # 格式化输出限制
            if max_output is not None:
                output_str = f"{max_output:,}"
            else:
                output_str = "N/A"
            
            print(f"   💾 输入限制: {Colors.WARNING}{input_str}{Colors.ENDC} tokens")
            print(f"   💾 输出限制: {Colors.WARNING}{output_str}{Colors.ENDC} tokens")
            
            # 标签
            tags = ', '.join(model.get('tags', []))
            if tags:
                print(f"   🏷️  标签: {Colors.OKCYAN}{tags}{Colors.ENDC}")
            
            # 摘要
            summary = model.get('summary', '')
            if summary:
                # 截断长摘要
                # if len(summary) > 80:
                    # summary = summary[:80] + "..."
                print(f"   📄 摘要: {summary}")
    
    def print_by_publisher(self, publisher: str):
        """按发布商筛选显示"""
        filtered = [m for m in self.data if m.get('publisher', '').lower() == publisher.lower()]
        
        if not filtered:
            print(f"{Colors.FAIL}❌ 未找到发布商 '{publisher}' 的模型{Colors.ENDC}")
            return
            
        print(f"\n{Colors.BOLD}{Colors.HEADER}🏢 {publisher} 的模型 ({len(filtered)}个){Colors.ENDC}")
        print(f"{'='*60}")
        
        for i, model in enumerate(filtered, 1):
            print(f"{i:2}. {Colors.OKBLUE}{model.get('name')}{Colors.ENDC}")
            print(f"    {model.get('summary', '')[:60]}...")
    
    def print_capabilities_matrix(self):
        """显示能力矩阵"""
        print(f"\n{Colors.BOLD}{Colors.HEADER}🔧 模型能力矩阵{Colors.ENDC}")
        print(f"{'='*80}")
        
        capabilities_count = defaultdict(int)
        models_with_caps = []
        
        for model in self.data:
            caps = model.get('capabilities', [])
            name = model.get('name', 'Unknown')
            # 限制名称长度但保持可读性
            if len(name) > 25:
                name = name[:22] + "..."
            models_with_caps.append((name, caps))
            for cap in caps:
                capabilities_count[cap] += 1
        
        # 显示能力统计
        print(f"\n{Colors.BOLD}📊 能力统计:{Colors.ENDC}")
        for cap, count in sorted(capabilities_count.items(), key=lambda x: x[1], reverse=True):
            print(f"  {Colors.OKCYAN}{cap:<20}{Colors.ENDC}: {Colors.OKGREEN}{count}{Colors.ENDC} 个模型")
        
        # 显示所有模型的能力矩阵
        print(f"\n{Colors.BOLD}🔗 模型能力详情:{Colors.ENDC}")
        all_caps = sorted(capabilities_count.keys())
        
        # 表头 - 使用固定宽度
        print(f"{'模型名称':<28}", end='')
        for cap in all_caps:
            # 截断能力名称以适应显示
            cap_display = cap[:8] if len(cap) > 8 else cap
            print(f"{cap_display:>10}", end='')
        print()
        
        print("-" * (28 + len(all_caps) * 10))
        
        for name, caps in models_with_caps:
            name_display = name[:25] if len(name) > 25 else name
            print(f"{name_display:<28}", end='')
            for cap in all_caps:
                symbol = "✅" if cap in caps else "❌"
                print(f"{symbol:>10}", end='')
            print()
            
        # 显示能力详情
        print(f"\n{Colors.BOLD}🎯 具体能力模型列表:{Colors.ENDC}")
        for cap in all_caps:
            models_with_cap = [m[0] for m in models_with_caps if cap in m[1]]
            if models_with_cap:
                print(f"\n{Colors.OKCYAN}{cap}{Colors.ENDC} ({len(models_with_cap)}个):")
                for i, model_name in enumerate(models_with_cap):
                    print(f"  {i+1}. {model_name}")

def main():
    parser = argparse.ArgumentParser(description='可视化JSON模型数据')
    parser.add_argument('file', nargs='?', help='JSON文件路径 (默认从stdin读取)')
    parser.add_argument('-s', '--summary', action='store_true', help='显示摘要')
    parser.add_argument('-l', '--list', type=int, metavar='N', help='显示详细列表 (可选择显示前N个)')
    parser.add_argument('-p', '--publisher', type=str, help='按发布商筛选')
    parser.add_argument('-c', '--capabilities', action='store_true', help='显示能力矩阵')
    parser.add_argument('--all', action='store_true', help='显示所有信息')
    
    args = parser.parse_args()
    
    try:
        # 读取JSON数据
        if args.file:
            with open(args.file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = json.load(sys.stdin)
        
        if not isinstance(data, list):
            print(f"{Colors.FAIL}❌ 错误: JSON数据应该是一个数组{Colors.ENDC}")
            sys.exit(1)
        
        visualizer = ModelVisualizer(data)
        
        # 根据参数执行相应操作
        if args.all:
            visualizer.print_summary()
            visualizer.print_detailed_list()
            visualizer.print_capabilities_matrix()
        elif args.summary:
            visualizer.print_summary()
        elif args.list is not None:
            visualizer.print_detailed_list(args.list if args.list > 0 else None)
        elif args.publisher:
            visualizer.print_by_publisher(args.publisher)
        elif args.capabilities:
            visualizer.print_capabilities_matrix()
        else:
            # 默认显示摘要
            visualizer.print_summary()
            print(f"\n{Colors.OKCYAN}💡 提示: 使用 -h 查看更多选项{Colors.ENDC}")
    
    except FileNotFoundError:
        print(f"{Colors.FAIL}❌ 文件未找到: {args.file}{Colors.ENDC}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"{Colors.FAIL}❌ JSON解析错误: {e}{Colors.ENDC}")
        sys.exit(1)
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}👋 已取消{Colors.ENDC}")
        sys.exit(0)

if __name__ == '__main__':
    main()
