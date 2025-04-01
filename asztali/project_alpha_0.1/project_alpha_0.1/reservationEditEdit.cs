using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class reservationEditEdit : Form
    {
        public reservationEditEdit()
        {
            InitializeComponent();
            Start();
            button1.Click += backBtn;
            button2.Click += modifyBtn;
            //
        }

        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;
            this.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Foglalások módosítása";
            label2.Text = "Foglalás kezdete:";
            label3.Text = "Foglalás vége:";
            label4.Text = "Parkolóház:";
            label5.Text = "Autó magassága:";
            button1.Text = "Vissza";
            button2.Text = "Módosítás";

            int label1Mid = label1.Width / 2;
            int button1Mid = button1.Width / 2;
            //int button2Mid = button2.Width / 2;
            //int label2Right = label2.Left - label2.Width;
            //int label3Right = label3.Left - label3.Width;
            //int label4Right = label4.Left - label4.Width;


            label1.Left = this.Width / 2 - label1Mid;
            button1.Left = this.Width / 2 - button1.Width - 40;
            button2.Left = this.Width / 2 + 40;

            textBox1.Left = button1.Left + button1Mid + 10;
            textBox2.Left = button1.Left + button1Mid + 10;
            textBox3.Left = button1.Left + button1Mid + 10;
            textBox4.Left = button1.Left + button1Mid + 10;

            label2.Left = (button1.Left + button1Mid) - label2.Width;
            label3.Left = (button1.Left + button1Mid) - label3.Width;
            label4.Left = (button1.Left + button1Mid) - label4.Width;
            label5.Left = (button1.Left + button1Mid) - label5.Width;

            label2.Top = textBox1.Top + ((textBox1.Height / 2) - (label2.Height / 2));
            label3.Top = textBox2.Top + ((textBox2.Height / 2) - (label3.Height / 2));
            label4.Top = textBox3.Top + ((textBox3.Height / 2) - (label4.Height / 2));
            label5.Top = textBox4.Top + ((textBox4.Height / 2) - (label5.Height / 2));
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Hide();
                reservationEdit reservationForm = new reservationEdit();
                reservationForm.ShowDialog();
            }
        }

        public void modifyBtn(object s, EventArgs e)
        {
            const string message = "Biztosan módosítani akarod a felhasználót?";
            const string caption = "Módosítás";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                const string message1 = "Fejlesztés alatt";
                const string caption1 = "Hiba";
                MessageBox.Show(message1, caption1,
                                             MessageBoxButtons.OK,
                                             MessageBoxIcon.Error);
            }
        }
    }
}
