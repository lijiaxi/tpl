
<style lang="stylus" scoped>
.filter-item {
  margin-right: 10px;
}

.filter-iteam1 {
  margin-right: 40px;
}

.dialog-footer {
  text-align: center;
}

/deep/ {
  .el-dialog__header {
    text-align: center;
  }
}

.preview-img {
  max-width: 100%;
}
</style>

<template>
  <div class="app-container calendar-list-container">
    <!-- filter 条件查询 -->
    <div class="filter-container">
      <el-form label-width="100px" inline label-position="left">
        <el-form-item label="类型：">
          <el-select
            clearable
            v-model="listQuery.type"
            filterable
            class="filter-item"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="开始日期：">
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            value-format='yyyy-MM-dd HH:mm:ss'
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="listQuery.endTime"
            type="datetime"
            value-format='yyyy-MM-dd HH:mm:ss'
            placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>-->
      </el-form>
      <el-button
        class="filter-item"
        icon="el-icon-circle-plus-outline"
        v-waves
        @click="beforOpenDialog(1)"
        type="primary"
      >新增</el-button>
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        :loading="downloadLoading"
        type="primary"
        v-waves
        icon="el-icon-refresh"
        @click="onRefreash"
      >刷新</el-button>
    </div>
    <!-- table 表格 -->
    <el-table
      :data="list"
      v-loading="loading.list"
      element-loading-text="给我一点时间~"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="序号" prop="index"/>
      <el-table-column align="center" label="主标题" prop="mainTitle"/>
      <el-table-column align="center" label="副标题" prop="subTitle"/>
      <el-table-column align="center" label="链接地址" prop="externalLink"/>
      <el-table-column align="center" label="logo图片">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" @click="beforeView(scope.row.logoUrl)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.type === 1">便民查询</el-tag>
          <el-tag type="info" v-else>办事指南</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否发布">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.isRelease === 1">未发布/下架</el-tag>
          <el-tag v-else>已发布/上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="ctime"/>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="beforOpenDialog(2, scope.row)" type="primary">编辑</el-button>
          <!-- <el-button icon="el-icon-open" @click="updateItem(scope.row.id, 1)" v-if="scope.row.status === 2" type="primary">启用</el-button>
          <el-button icon="el-icon-turn-off" @click="updateItem(scope.row.id, 2)" v-else type="warning">禁用</el-button>-->
          <el-button icon="el-icon-delete" @click="deleteItem(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.offset"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog v-dragDialog :title="diglogTitle" :visible.sync="dialog.add">
      <el-form :model="addQuery" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="主标题" prop="mainTitle">
          <el-input v-model="addQuery.mainTitle" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subTitle">
          <el-input v-model="addQuery.subTitle" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="externalLink">
          <el-input v-model="addQuery.externalLink" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="展示顺序" prop="priority">
          <el-input-number
            v-model="addQuery.priority"
            :step="1"
            :step-strictly="true"
            controls-position="right"
            :min="1"
            :max="99"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            clearable
            v-model="addQuery.type"
            filterable
            class="filter-item"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="logoUrl">
          <el-upload
            class="upload-demo"
            :action="$uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :limit="1"
            :file-list="fileList"
            :data="{'fileName': 'carousel'}"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading.add"
            @click="addtem"
          >确定{{dialogType === 1 ? '添加' : '编辑'}}</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="图片详情" v-dragDialog :visible.sync="dialog.view">
      <div style="text-align:center">
        <img :src="imgUrl" class="preview-img" alt>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableMixins from "@/mixins/table";
import * as api from "@/service/guide";
export default {
  mixins: [tableMixins],
  name: "guide",
  data() {
    return {
      total: 0,
      list: null,
      dialogType: 1,
      imgUrl: "",
      loading: {
        list: false,
        add: false,
        download: false
      },
      dialog: {
        add: false,
        view: false
      },
      listQuery: {
        type: ""
      },
      addQuery: {
        type: "",
        externalLink: "",
        mainTitle: "",
        subTitle: "",
        priority: 1,
        logoUrl: ""
      },
      rules: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        logoUrl: [{ required: true, message: "请上传logo", trigger: "change" }],
        externalLink: [
          { required: true, message: "请输入链接地址", trigger: "blur" }
        ],
        priority: [
          { required: true, message: "请输入展示顺序", trigger: "blur" }
        ],
        mainTitle: [
          { required: true, message: "请输入主标题", trigger: "blur" }
        ],
        subTitle: [{ required: true, message: "请输入副标题", trigger: "blur" }]
      },
      options: [
        {
          label: "便民查询",
          value: 1
        },
        {
          label: "办事指南",
          value: 2
        }
      ],
      fileList: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    beforeUpload(file) {
      if (file && file.size) {
        if (file.size > 1024 * 1024) {
          this.$message.warning("只能上传小于1M的图片");
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    handleSuccess(res, file, fileList) {
      this.addQuery.logoUrl = res.data;
    },
    handleRemove(file, fileList) {
      this.addQuery.logoUrl = "";
    },
    handlePreview() {
      this.imgUrl = url;
      this.dialog.view = true;
    },
    beforeView(url) {
      this.imgUrl = url;
      this.dialog.view = true;
    },
    async fetchData() {
      try {
        this.loading.list = true;
        const { data } = await api.getList(this.listQuery);
        this.list = data.records.map((item, index) => {
          return {
            ...item,
            index: index + 1
          };
        });
        this.total = data.total;
        this.loading.list = false;
      } catch (error) {
        this.loading.list = false;
      }
    },
    deleteItem(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [h("span", null, "确定删除吗?")]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.deleteItem({ id });
              this.$message({
                type: "success",
                message: "删除成功"
              });
              instance.confirmButtonLoading = false;
              done();
              this.fetchData();
            } catch (error) {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      });
    },
    updateItem(id, status) {
      const msg = status === 1 ? "确定启用?" : "确定禁用?";
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [h("span", null, msg)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.updateItem({ id });
              this.$message({
                type: "success",
                message: "操作成功"
              });
              instance.confirmButtonLoading = false;
              done();
              this.fetchData();
            } catch (error) {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      });
    },
    addtem() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            this.loading.add = true;
            if (this.dialogType === 1) {
              await api.addtem(this.addQuery);
            } else {
              await api.updateItem(this.addQuery);
            }
            this.$message.success("操作成功");
            this.dialog.add = false;
            this.loading.add = false;
            this.resetForm();
            this.fetchData();
          } catch (error) {
            this.loading.add = false;
          }
        } else {
          return false;
        }
      });
    },
    resetForm(flag) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      if (flag) {
        this.addQuery = {
          type: "",
          externalLink: "",
          mainTitle: "",
          subTitle: "",
          priority: 1,
          logoUrl: ""
        };
        this.fileList = [];
      }
    },
    beforOpenDialog(type, item) {
      if (type === 1) {
        this.resetForm(1);
      } else {
        this.resetForm();
        const {
          id,
          type,
          externalLink,
          mainTitle,
          subTitle,
          priority,
          logoUrl
        } = item;
        this.addQuery = {
          ...this.addQuery,
          id,
          type,
          externalLink,
          mainTitle,
          subTitle,
          priority,
          logoUrl
        };
        this.fileList = [{ name: "", url: logoUrl }];
      }
      this.dialogType = type;
      this.dialog.add = true;
    }
  },
  computed: {
    diglogTitle() {
      return this.dialogType === 1 ? "新增办事指南" : "编辑办事指南";
    }
  }
};
</script>
